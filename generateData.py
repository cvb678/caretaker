import requests
import random
from time import sleep


for j in range (20):
	for i in range(200):
		payload = {"time": (i*2+j*400), "value": random.randint(1,100)+25, "value2": random.randint(1,100)+25, "pulse": random.randint(60, 90)}
		requests.post('http://127.0.0.1:8081/add', json=payload)
		sleep(0.01)
	sleep(1)

