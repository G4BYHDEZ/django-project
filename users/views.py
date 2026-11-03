from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import PersonalDataSerializer, RegisterUserSerializer, UserSerializer


class UserApiViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class PersonalDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = PersonalDataSerializer(request.user)
        return Response(serializer.data)


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'message': 'Usuario registrado exitosamente',
                'user': {'username': user.username, 'email': user.email},
            },
            status=status.HTTP_201_CREATED,
        )


class SoapCapitalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, country_code):
        wsdl = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'
        try:
            from requests import Session
            from zeep import Client
            from zeep.transports import Transport

            transport = Transport(session=Session(), timeout=5, operation_timeout=8)
            client = Client(wsdl=wsdl, transport=transport)
            capital = client.service.CapitalCity(country_code.upper())
        except Exception:
            return Response(
                {'detail': 'No fue posible consultar el servicio SOAP.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({'country_code': country_code.upper(), 'capital': capital})
