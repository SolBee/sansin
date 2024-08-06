from flask import Flask, jsonify, request, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='client/build')

# Enable CORS
CORS(app)

# MongoDB 설정
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

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


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)