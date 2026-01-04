#!/usr/bin/env python3
"""
Cursor Filter Bridge - Routes Cursor AI requests to local Ollama
Created: December 2025
Purpose: Make Cursor use local AI instead of Cursor's cloud AI
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow Cursor to connect

# Configuration
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
API_KEY = os.getenv('CURSOR_FILTER_KEY', 'xibalba-backend-filter-key')
DEFAULT_MODEL = os.getenv('DEFAULT_OLLAMA_MODEL', 'qwen2.5-coder:7b')

# Request log with detailed tracking
request_log = []
cursor_requests = []  # Track Cursor-specific requests

def log_request(endpoint, data, response_status=200, source="unknown"):
    """Log requests for debugging"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'endpoint': endpoint,
        'status': response_status,
        'source': source,
        'user_agent': request.headers.get('User-Agent', 'unknown')[:100] if hasattr(request, 'headers') else 'unknown',
        'data_preview': str(data)[:200] if data else None
    }
    request_log.append(log_entry)
    
    # Track Cursor requests specifically
    if 'cursor' in log_entry['user_agent'].lower() or 'cursor' in endpoint.lower():
        cursor_requests.append(log_entry)
        # Keep last 50 Cursor requests
        if len(cursor_requests) > 50:
            cursor_requests.pop(0)
    
    # Keep only last 100 requests
    if len(request_log) > 100:
        request_log.pop(0)

@app.route('/api/cursor/filter', methods=['POST', 'OPTIONS'])
def cursor_filter():
    """
    Main endpoint: Translates Cursor's OpenAI-format requests to Ollama format
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Get request source info
    user_agent = request.headers.get('User-Agent', 'unknown')
    source = 'cursor' if 'cursor' in user_agent.lower() else 'other'
    
    # Verify API key (optional for local use - comment out for testing)
    # auth_header = request.headers.get('Authorization', '')
    # if API_KEY not in auth_header and request.headers.get('X-API-Key') != API_KEY:
    #     log_request('/api/cursor/filter', None, 401, source)
    #     return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        log_request('/api/cursor/filter', data, 200, source)
        
        # Print to console for immediate visibility
        print(f"\n🔵 CURSOR REQUEST DETECTED! [{datetime.now().strftime('%H:%M:%S')}]")
        print(f"   User-Agent: {user_agent[:80]}")
        print(f"   Model: {data.get('model', 'unknown')}")
        print(f"   Messages: {len(data.get('messages', []))}")
        print(f"   Stream: {data.get('stream', False)}")
        
        # Extract messages from OpenAI format
        messages = data.get('messages', [])
        if not messages:
            return jsonify({'error': 'No messages provided'}), 400
        
        # Convert messages to prompt (simple concatenation)
        prompt_parts = []
        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            if isinstance(content, list):
                # Handle multipart content
                text_parts = [c.get('text', '') for c in content if c.get('type') == 'text']
                content = ' '.join(text_parts)
            
            if role == 'system':
                prompt_parts.append(f"System: {content}")
            elif role == 'user':
                prompt_parts.append(f"User: {content}")
            elif role == 'assistant':
                prompt_parts.append(f"Assistant: {content}")
        
        prompt = '\n\n'.join(prompt_parts)
        
        # Get model (map Cursor's model to Ollama model)
        cursor_model = data.get('model', 'xibalba-filtered-model')
        ollama_model = map_cursor_model_to_ollama(cursor_model)
        
        # Prepare Ollama request
        ollama_payload = {
            'model': ollama_model,
            'prompt': prompt,
            'stream': data.get('stream', False),
            'options': {
                'temperature': data.get('temperature', 0.7),
                'num_predict': data.get('max_tokens', 4000)
            }
        }
        
        # Call Ollama
        if ollama_payload['stream']:
            # Handle streaming
            return stream_ollama_response(ollama_payload)
        else:
            # Handle non-streaming
            response = requests.post(
                f'{OLLAMA_URL}/api/generate',
                json=ollama_payload,
                timeout=120
            )
            
            if response.status_code != 200:
                return jsonify({
                    'error': f'Ollama error: {response.status_code}',
                    'details': response.text
                }), 500
            
            ollama_data = response.json()
            response_text = ollama_data.get('response', '')
            
            # Convert to OpenAI format
            return jsonify({
                'id': f'chatcmpl-{datetime.now().timestamp()}',
                'object': 'chat.completion',
                'created': int(datetime.now().timestamp()),
                'model': cursor_model,
                'choices': [{
                    'index': 0,
                    'message': {
                        'role': 'assistant',
                        'content': response_text
                    },
                    'finish_reason': 'stop'
                }],
                'usage': {
                    'prompt_tokens': ollama_data.get('prompt_eval_count', 0),
                    'completion_tokens': ollama_data.get('eval_count', 0),
                    'total_tokens': ollama_data.get('prompt_eval_count', 0) + ollama_data.get('eval_count', 0)
                }
            })
            
    except Exception as e:
        log_request('/api/cursor/filter', {'error': str(e)}, 500)
        return jsonify({'error': str(e)}), 500

def stream_ollama_response(ollama_payload):
    """Handle streaming responses"""
    from flask import Response, stream_with_context
    
    def generate():
        try:
            response = requests.post(
                f'{OLLAMA_URL}/api/generate',
                json=ollama_payload,
                stream=True,
                timeout=120
            )
            
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        chunk_text = data.get('response', '')
                        if chunk_text:
                            # Format as OpenAI streaming response
                            chunk = {
                                'id': f'chatcmpl-{datetime.now().timestamp()}',
                                'object': 'chat.completion.chunk',
                                'created': int(datetime.now().timestamp()),
                                'model': ollama_payload['model'],
                                'choices': [{
                                    'index': 0,
                                    'delta': {'content': chunk_text},
                                    'finish_reason': None
                                }]
                            }
                            yield f"data: {json.dumps(chunk)}\n\n"
                        
                        if data.get('done', False):
                            yield "data: [DONE]\n\n"
                            break
                    except json.JSONDecodeError:
                        continue
        except Exception as e:
            error_chunk = {
                'error': str(e)
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"
    
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

def map_cursor_model_to_ollama(cursor_model):
    """Map Cursor's model names to Ollama models"""
    model_map = {
        'xibalba-filtered-model': DEFAULT_MODEL,
        'gpt-4': 'qwen2.5-coder:7b',
        'gpt-3.5-turbo': 'qwen2.5-coder:7b',
        'claude': 'Xibalba-Studio/thrawn-commander:latest',
    }
    return model_map.get(cursor_model, DEFAULT_MODEL)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        # Check Ollama
        ollama_response = requests.get(f'{OLLAMA_URL}/api/tags', timeout=2)
        ollama_status = 'connected' if ollama_response.status_code == 200 else 'disconnected'
    except:
        ollama_status = 'disconnected'
    
    return jsonify({
        'status': 'healthy',
        'ollama': ollama_status,
        'ollama_url': OLLAMA_URL,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/verify', methods=['GET'])
def verify():
    """Verification endpoint - shows if Cursor has connected"""
    return jsonify({
        'bridge_running': True,
        'total_requests': len(request_log),
        'cursor_requests': len(cursor_requests),
        'last_cursor_request': cursor_requests[-1] if cursor_requests else None,
        'recent_requests': request_log[-10:],
        'cursor_detected': len(cursor_requests) > 0,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/status', methods=['GET'])
def status():
    """Status page with UI"""
    try:
        ollama_response = requests.get(f'{OLLAMA_URL}/api/tags', timeout=2)
        ollama_models = []
        if ollama_response.status_code == 200:
            models_data = ollama_response.json()
            ollama_models = [m.get('name', '') for m in models_data.get('models', [])]
        ollama_status = 'connected'
    except:
        ollama_status = 'disconnected'
        ollama_models = []
    
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Cursor Filter Bridge - Status</title>
        <style>
            body { font-family: monospace; margin: 40px; background: #1a1a1a; color: #fff; }
            .status { padding: 20px; background: #2a2a2a; border-radius: 8px; margin: 20px 0; }
            .success { color: #4ade80; }
            .error { color: #f87171; }
            .info { color: #60a5fa; }
            h1 { color: #fbbf24; }
            .log { max-height: 400px; overflow-y: auto; background: #000; padding: 10px; border-radius: 4px; }
            .log-entry { margin: 5px 0; font-size: 12px; }
        </style>
    </head>
    <body>
        <h1>🔌 Cursor Filter Bridge</h1>
        
        <div class="status">
            <h2>Service Status</h2>
            <p>Bridge: <span class="success">✅ Running on port 8080</span></p>
            <p>Ollama: <span class="{}">{}</span></p>
            <p>Ollama URL: <span class="info">{}</span></p>
            <p>Default Model: <span class="info">{}</span></p>
        </div>
        
        <div class="status">
            <h2>Available Ollama Models</h2>
            <ul>
                {}
            </ul>
        </div>
        
        <div class="status">
            <h2>Cursor Connection Status</h2>
            <p>Total Requests: <span class="info">{}</span></p>
            <p>Cursor Requests Detected: <span class="{}">{}</span></p>
            <p>Last Cursor Request: <span class="info">{}</span></p>
        </div>
        
        <div class="status">
            <h2>Recent Requests (Last 10)</h2>
            <div class="log">
                {}
            </div>
        </div>
        
        <div class="status">
            <h2>Configuration</h2>
            <p>Endpoint: <code>http://localhost:8080/api/cursor/filter</code></p>
            <p>API Key: <code>{}</code></p>
            <p>Cursor Settings: Already configured ✅</p>
        </div>
    </body>
    </html>
    """.format(
        'success' if ollama_status == 'connected' else 'error',
        '✅ Connected' if ollama_status == 'connected' else '❌ Disconnected',
        OLLAMA_URL,
        DEFAULT_MODEL,
        len(request_log),
        'success' if len(cursor_requests) > 0 else 'error',
        '✅ YES' if len(cursor_requests) > 0 else '❌ NO',
        cursor_requests[-1]['timestamp'] if cursor_requests else 'Never',
        ''.join([f'<li>{m}</li>' for m in ollama_models[:10]]),
        ''.join([f'<div class="log-entry">[{r["timestamp"]}] {r["endpoint"]} - {r["source"]} - Status: {r["status"]}</div>' 
                for r in request_log[-10:]]),
        API_KEY
    )
    
    return html

if __name__ == '__main__':
    print("=" * 60)
    print("Cursor Filter Bridge - Starting")
    print("=" * 60)
    print(f"Ollama URL: {OLLAMA_URL}")
    print(f"Default Model: {DEFAULT_MODEL}")
    print(f"API Key: {API_KEY}")
    print(f"Status UI: http://localhost:8080/status")
    print("=" * 60)
    app.run(host='0.0.0.0', port=8080, debug=False)

