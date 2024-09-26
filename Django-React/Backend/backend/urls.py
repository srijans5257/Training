
from django.contrib import admin
from django.urls import path,include
from api.views import CreateUserView,UserProfileView,ProjectListView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/",CreateUserView.as_view(),name="register"),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    path("api/token/",TokenObtainPairView.as_view(),name="get_token"),
    path("api/token/refresh/",TokenRefreshView.as_view(),name="refresh"),
    path("api-auth/",include("rest_framework.urls")),
    path('api/projects/', ProjectListView.as_view(), name='project-list'),
    path("api/",include("api.urls")),
]
