from django_filters import rest_framework as filters
from .models import Resource, ResourceType, TargetUserGroup, AgeGroup, Keyword, Topic
from django.db.models import Q


class ResourceFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')  # Case-insensitive partial match
    description = filters.CharFilter(lookup_expr='icontains')
    language = filters.ChoiceFilter(choices=Resource.LANGUAGE_CHOICES)
    resource_type = filters.ModelMultipleChoiceFilter(
        field_name='resource_type__id',
        to_field_name='id',
        queryset=ResourceType.objects.all()
    )
    target_user_groups = filters.ModelMultipleChoiceFilter(
        field_name='target_user_groups__id',
        to_field_name='id',
        queryset=TargetUserGroup.objects.all()
    )
    age_groups = filters.ModelMultipleChoiceFilter(
        field_name='age_groups__id',
        to_field_name='id',
        queryset=AgeGroup.objects.all()
    )
    keywords = filters.ModelMultipleChoiceFilter(
        field_name='keywords__id',
        to_field_name='id',
        queryset=Keyword.objects.all()
    )
    topic = filters.ModelMultipleChoiceFilter(
        field_name='topic__id',
        to_field_name='id',
        queryset=Topic.objects.all()
    )
    author = filters.CharFilter(lookup_expr='icontains')
    created_at = filters.DateFromToRangeFilter()  # Supports date range (e.g., created_at_after, created_at_before)
    modified_at = filters.DateFromToRangeFilter()

    # Custom filter for file or URL presence
    has_file = filters.BooleanFilter(method='filter_has_file')
    has_url = filters.BooleanFilter(method='filter_has_url')

    from django.db.models import Q

    def filter_has_file(self, queryset, name, value):
        if value:
            return queryset.filter(~Q(upload_file=""), upload_file__isnull=False)
        else:
            return queryset.filter(Q(upload_file="") | Q(upload_file__isnull=True))

    def filter_has_url(self, queryset, name, value):
        if value:
            return queryset.filter(~Q(upload_url=""), upload_url__isnull=False)
        else:
            return queryset.filter(Q(upload_url="") | Q(upload_url__isnull=True))

    class Meta:
        model = Resource
        fields = [
            'title', 'description', 'language', 'resource_type', 'target_user_groups',
            'age_groups', 'keywords', 'topic', 'author', 'created_at', 'modified_at',
            'has_file', 'has_url'
        ]
