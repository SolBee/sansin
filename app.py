from flask import Flask, jsonify, request, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='client/build')

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# MongoDB 설정
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # JWT 시크릿 키
mongo = PyMongo(app)
jwt = JWTManager(app)

@app.route('/api/locations', methods=['GET'])
def get_locations():
    try:
        locations = mongo.db.connect_sans.find()
        result = []
        for location in locations:
            result.append({
                'name': location.get('name', ''),
                'group': location.get('group', ''),
                'country': location['country'],
                'residence': location.get('residence', ''),
                'latitude': location.get('latitude', ''),
                'longitude': location.get('longitude', '')
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({'message': 'Server is running'}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    print("Received signup data:", data)  # 디버깅을 위한 로그 추가
    try:
        mongo.db.connect_sans.insert_one({
            'name': data['name'],
            'group': data['group'],
            'country': data['country'],
            'residence': data['residence'],
            'job': data['job'],
            'job_detail': data['job_detail'],
            'interests': data['interests'],
            'club': data['club'],
            'latitude': data['latitude'],
            'longitude': data['longitude'],
            'email': data['email'],
            'password': data['password']
        })
        return jsonify({'message': 'User added successfully'}), 201
    except Exception as e:
        print("Error:", str(e))  # 에러 메시지 로그 추가
        return jsonify({'error': str(e)}), 400


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = mongo.db.connect_sans.find_one({
        'email': data['email'],
        'password': data['password']
    })
    if user:
        return jsonify({'message': 'Login successful', 'user': {'name': user['name'], 'email': user['email']}})
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

@app.route('/api/users', methods=['GET'])
def get_users():
    users = mongo.db.connect_sans.find({}, {'password': 0})  # 비밀번호 제외
    result = []
    for user in users:
        user['_id'] = str(user['_id'])  # ObjectId를 문자열로 변환
        result.append(user)
    return jsonify(result)

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/api/user/<email>', methods=['GET'])
def get_user(email):
    user = mongo.db.connect_sans.find_one({'email': email}, {'password': 0})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user)
    else:
        return jsonify({'message': 'User not found'}), 404
    
@app.route('/api/user/<email>', methods=['PUT'])
@jwt_required()
def update_user(email):
    data = request.json
    update_data = {k: v for k, v in data.items() if v}  # 빈 값 무시
    print("Received data for update:", update_data)  # 디버깅 로그 추가
    result = mongo.db.connect_sans.update_one({'email': email}, {'$set': update_data})
    if result.modified_count > 0:
        return jsonify({'message': 'User updated successfully'})
    else:
        return jsonify({'message': 'No changes made'}), 400
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)