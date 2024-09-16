from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, EmployeeViewSet, WFHApplicationViewSet, WFHTaskViewSet,RegisterView,LoginView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'wfh-applications', WFHApplicationViewSet)
router.register(r'wfh-tasks', WFHTaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
