import requests
 

url = "https://www.facebook.com/"
print(requests.request("GET", url).text)
