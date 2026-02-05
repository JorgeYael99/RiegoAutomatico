from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pymysql
import os
import ssl # <--- NECESARIO PARA AIVEN
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)

# Permite conexiones desde cualquier origen
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# CONFIGURACIÓN SECRET KEY
app.secret_key = os.getenv('SECRET_KEY', 'una_clave_secreta_segura')

# ------------------------------
# CONEXIÓN BASE DE DATOS (Arreglada para Aiven + Vercel)
# ------------------------------
def conectar_db():
    # Creamos un contexto SSL que "perdona" si el certificado no es perfecto
    # Esto evita el error "SSL connection error" en Aiven
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    return pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME'),
        port=int(os.getenv('DB_PORT', 11416)),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        ssl=ssl_context # <--- USAMOS EL CONTEXTO IMPORTADO
    )

# ------------------------------
# RUTA DE LOGOUT (Con prefijo /api)
# ------------------------------
@app.route('/api/logout') # <--- CAMBIO AQUÍ
def logout():
    session.clear()
    return jsonify({'message': 'Sesión cerrada correctamente'})

# ------------------------------
# RUTA DE LOGIN (Con prefijo /api)
# ------------------------------
@app.route('/api/login', methods=['POST']) # <--- CAMBIO AQUÍ
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Nombre de usuario y contraseña son requeridos'}), 400

    try:
        conn = conectar_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, password, role FROM usuarios WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            if check_password_hash(user['password'], password):
                session['user_id'] = user['id']
                session['username'] = user['username']
                session['role'] = user['role']
                return jsonify({
                    'success': True,
                    'role': user['role'],
                    'redirect': '/admin/dashboard' if user['role'] == 'admin' else '/dashboard'
                })
            else:
                return jsonify({'success': False, 'message': 'Credenciales inválidas'})
        else:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'})

    except Exception as e:
        print(f"Error Login: {str(e)}") # Esto ayuda a verlo en los logs de Vercel
        return jsonify({'success': False, 'message': f'Error de conexión: {str(e)}'}), 500

# ------------------------------
# RUTA DE REGISTRO (Con prefijo /api)
# ------------------------------
@app.route('/api/register', methods=['POST']) # <--- CAMBIO AQUÍ
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Nombre de usuario y contraseña son requeridos'}), 400

    try:
        conn = conectar_db()
        cursor = conn.cursor()

        # Verificar si existe
        cursor.execute("SELECT id FROM usuarios WHERE username = %s", (username,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'El nombre de usuario ya está en uso'}), 400

        # Crear usuario
        hashed_password = generate_password_hash(password)
        cursor.execute("INSERT INTO usuarios (username, password, role) VALUES (%s, %s, %s)", (username, hashed_password, 'user'))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'success': True, 'message': 'Registro exitoso. Puedes iniciar sesión ahora.'})
    
    except Exception as e:
        print(f"Error Registro: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

# ------------------------------
# RUTAS DE PRUEBA
# ------------------------------
@app.route('/')
def home():
    return "API Riego Automático Funcionando 💧"

if __name__ == '__main__':
    app.run(debug=True)