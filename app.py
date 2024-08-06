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

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
