import requests
import random
from time import sleep


for j in range (10):
	for i in range(200):
		payload = {"time": (i*2+j*400), "value": random.randint(1,100)+25}
		requests.post('http://127.0.0.1:8081/add', json=payload)
		sleep(0.1)
	sleep(10)

