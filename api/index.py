from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import pymysql
import os
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)

# Permite conexiones desde cualquier origen (Local y Vercel)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# CONFIGURACIÓN SECRET KEY
# Intenta leerla de Vercel, si no existe usa la frase local
app.secret_key = os.getenv('SECRET_KEY', 'una_clave_secreta_segura')

# ------------------------------
# CONEXIÓN BASE DE DATOS
# ------------------------------
def conectar_db():
    return pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        db=os.getenv('DB_NAME'),
        port=int(os.getenv('DB_PORT', 3306)),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor, # Importante para acceder como user['id']
        # Corrección de sintaxis SSL para Aiven:
        ssl={'ca': '/etc/ssl/cert.pem'}
    )

# ------------------------------
# RUTA DE LOGOUT
# ------------------------------
@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'Sesión cerrada correctamente'})

# ------------------------------
# RUTA DE LOGIN
# ------------------------------
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Nombre de usuario y contraseña son requeridos'}), 400

    try:
        conn = conectar_db()
        cursor = conn.cursor()
        # Buscamos al usuario
        cursor.execute("SELECT id, username, password, role FROM usuarios WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            # user[2] es password, user[0] es id, etc. (Si usas DictCursor sería user['password'])
            # Como tu código original usaba índices (user[2]),
            # he ajustado la conexión arriba para usar DictCursor y aquí abajo usar claves, 
            # ES MÁS SEGURO. Mira el cambio abajo:
            
            # Nota: Si arriba puse cursorclass=DictCursor, aquí debes usar nombres:
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
        return jsonify({'success': False, 'message': f'Error de conexión: {str(e)}'}), 500

# ------------------------------
# RUTA DE REGISTRO
# ------------------------------
@app.route('/register', methods=['POST'])
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
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

# ------------------------------
# RUTAS DE DASHBOARD
# ------------------------------
@app.route('/admin/dashboard')
def admin_dashboard():
    return "Panel de administración (Backend)"

@app.route('/dashboard')
def user_dashboard():
    return "Panel de usuario (Backend)"

# Ruta raíz para verificar que el servidor vive
@app.route('/')
def home():
    return "API Riego Automático Funcionando 💧"

if __name__ == '__main__':
    app.run(debug=True)