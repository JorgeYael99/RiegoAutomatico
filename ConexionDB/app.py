from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import pymysql  # ¡Importa pymysql!
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
app.secret_key = 'una_clave_secreta_segura'

# ------------------------------
# RUTA DE LOGOUT
# ------------------------------
@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'Sesión cerrada correctamente'})

DB_HOST = '172.31.160.1'
DB_USER = 'yael'  # Usuario con permisos remotos (%)
DB_PASSWORD = 'admin'
DB_NAME = 'usuariodb'

def conectar_db():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME,
        charset='utf8mb4'
    )

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Nombre de usuario y contraseña son requeridos'}), 400

    conn = conectar_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password, role FROM usuarios WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        if check_password_hash(user[2], password):
            session['user_id'] = user[0]
            session['username'] = user[1]
            session['role'] = user[3]
            return jsonify({
                'success': True,
                'role': user[3],
                'redirect': '/admin/dashboard' if user[3] == 'admin' else '/dashboard'
            })
        else:
            return jsonify({'success': False, 'message': 'Credenciales inválidas'})
    else:
        return jsonify({'success': False, 'message': 'Usuario no encontrado'})

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Nombre de usuario y contraseña son requeridos'}), 400

    conn = conectar_db()
    cursor = conn.cursor()

    # Verificar si el nombre de usuario ya existe
    cursor.execute("SELECT id FROM usuarios WHERE username = %s", (username,))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': 'El nombre de usuario ya está en uso'}), 400

    # Almacenar el nuevo usuario
    hashed_password = generate_password_hash(password)
    cursor.execute("INSERT INTO usuarios (username, password, role) VALUES (%s, %s, %s)", (username, hashed_password, 'user'))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'message': 'Registro exitoso. Puedes iniciar sesión ahora.'})

@app.route('/admin/dashboard')
def admin_dashboard():
    return "Panel de administración (Backend)"

@app.route('/dashboard')
def user_dashboard():
    return "Panel de usuario (Backend)"

if __name__ == '__main__':
    app.run(debug=True)