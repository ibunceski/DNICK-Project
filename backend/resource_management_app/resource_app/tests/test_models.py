import pytest
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from resource_app.models import Resource


@pytest.mark.django_db
def test_resource_creation():
    resource = Resource.objects.create(title="Dataset 1", description="ML Dataset")

    assert resource.pk is not None
    assert resource.title == "Dataset 1"
    assert str(resource) == "Dataset 1"


@pytest.mark.django_db
def test_resource_str_and_creation():
    resource = Resource.objects.create(title="Test Resource", language="en")
    assert str(resource) == "Test Resource"
    assert resource.language == "en"


@pytest.mark.django_db
def test_resource_clean_requires_file_or_url():
    resource = Resource(title="Invalid Resource", language="en")
    with pytest.raises(ValidationError):
        resource.clean()


@pytest.mark.django_db
def test_resource_clean_accepts_file_or_url(tmp_path):
    test_file = tmp_path / "test.txt"
    test_file.write_text("dummy content")

    resource = Resource(title="Valid File Resource", language="en", upload_file=test_file)
    resource.clean()  # Should not raise

    resource2 = Resource(title="Valid URL Resource", language="en", upload_url="https://example.com")
    resource2.clean()  # Should not raise

    resource3 = Resource(title="Valid URL Resource", language="en", upload_url="https://example.com",
                         upload_file=test_file)
    with pytest.raises(ValidationError):
        resource3.clean() # Should raise - url and file added

@pytest.mark.django_db
def test_resource_many_to_many_empty():
    user = User.objects.create_user(username="tester", password="pass123")
    resource = Resource.objects.create(title="Empty M2M", language="en", upload_url="https://e.com", user=user)
    assert resource.keywords.count() == 0
    assert resource.resource_type.count() == 0
