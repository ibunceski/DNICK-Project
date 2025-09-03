from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'resources', ResourceViewSet)
router.register(r'resource-types', ResourceTypeViewSet)
router.register(r'keywords', KeywordViewSet)
router.register(r'age-groups', AgeGroupViewSet)
router.register(r'target-user-groups', TargetUserGroupViewSet)
router.register(r'topics', TopicViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
