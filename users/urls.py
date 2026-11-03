from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import PersonalDataView, RegisterUserView, SoapCapitalView, UserApiViewSet

router = DefaultRouter()
router.register('users', UserApiViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/me/', PersonalDataView.as_view(), name='personal-data'),
    path('auth/register/', RegisterUserView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('soap/capital/<str:country_code>/', SoapCapitalView.as_view(), name='soap-capital'),
]
