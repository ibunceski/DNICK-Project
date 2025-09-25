from locust import HttpUser, task, between
import random

class ResourceUser(HttpUser):
    wait_time = between(1, 3)  # users wait 1-3s between actions
    resource_ids = []

    @task(3)  # most common action
    def list_resources(self):
        self.client.get("/api/resources/")

    @task(2)
    def create_resource(self):
        payload = {
            "title": f"LoadTest Resource {random.randint(1, 100000)}",
            "description": "Created during Locust test",
            "upload_url": "https://example.com/test",
            "language": "en"
        }
        with self.client.post("/api/resources/", json=payload, catch_response=True) as response:
            if response.status_code == 201:
                rid = response.json().get("id")
                if rid:
                    self.resource_ids.append(rid)
            else:
                response.failure(f"Failed to create resource: {response.text}")

    @task(2)
    def get_resource(self):
        if self.resource_ids:
            rid = random.choice(self.resource_ids)
            self.client.get(f"/api/resources/{rid}/")

    @task(1)
    def update_resource(self):
        if self.resource_ids:
            rid = random.choice(self.resource_ids)
            payload = {
                "title": "Updated Title",
                "description": "Updated via Locust",
                "upload_url": "https://finki.ukim.mk",
                "language": "en"
            }
            self.client.put(f"/api/resources/{rid}/", json=payload)

    @task(1)
    def delete_resource(self):
        if self.resource_ids:
            rid = self.resource_ids.pop()
            self.client.delete(f"/api/resources/{rid}/")
