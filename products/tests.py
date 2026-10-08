from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Product


User = get_user_model()


class ProductAPITests(APITestCase):
    # products/tests.py (agregar a la clase ProductTestCase que ya tienen de la Práctica 5)
    def test_precio_final_autenticado(self):
        response = self.client.get(f'/api/v1/products/{self.product.id}/precio-final/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('precio_final', response.data)
    def test_precio_final_sin_autenticar(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(f'/api/v1/products/{self.product.id}/precio-final/')
        self.assertEqual(response.status_code, 401)
        
    def setUp(self):
        """
        Se ejecuta antes de cada prueba.
        Crea un usuario y lo autentica.
        """

        self.user = User.objects.create_user(
            username='testuser',
            password='Test12345'
        )

        self.client.force_authenticate(user=self.user)

    # 1. Crear una categoría
    def test_crear_categoria(self):

        url = reverse('categories-list')

        data = {
            'name': 'Medicamentos'
        }

        response = self.client.post(
            url,
            data,
            format='json'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            Category.objects.count(),
            1
        )

        self.assertEqual(
            Category.objects.first().name,
            'Medicamentos'
        )

    # 2. Listar categorías
    def test_listar_categorias(self):

        Category.objects.create(
            name='Medicamentos'
        )

        Category.objects.create(
            name='Higiene'
        )

        Category.objects.create(
            name='Vitaminas'
        )

        url = reverse('categories-list')

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            3
        )

    # 3. Crear un producto
    def test_crear_producto(self):

        category = Category.objects.create(
            name='Medicamentos'
        )

        url = reverse('products-list')

        data = {
            'name': 'Paracetamol',
            'category': category.id,
            'description': 'Analgésico y antipirético',
            'price': '50.00',
            'is_active': True
        }

        response = self.client.post(
            url,
            data,
            format='json'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            Product.objects.count(),
            1
        )

        self.assertEqual(
            Product.objects.first().name,
            'Paracetamol'
        )

    # 4. Listar productos
    def test_listar_productos(self):

        category = Category.objects.create(
            name='Medicamentos'
        )

        Product.objects.create(
            name='Paracetamol',
            category=category,
            description='Analgésico',
            price='50.00',
            is_active=True
        )

        Product.objects.create(
            name='Ibuprofeno',
            category=category,
            description='Antiinflamatorio',
            price='75.00',
            is_active=True
        )

        url = reverse('products-list')

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            2
        )

    # 5. Actualizar un producto
    def test_actualizar_producto(self):

        category = Category.objects.create(
            name='Medicamentos'
        )

        product = Product.objects.create(
            name='Paracetamol',
            category=category,
            description='Analgésico',
            price='50.00',
            is_active=True
        )

        url = reverse(
            'products-detail',
            kwargs={'pk': product.id}
        )

        data = {
            'name': 'Paracetamol 500mg',
            'category': category.id,
            'description': 'Analgésico y antipirético de 500mg',
            'price': '65.00',
            'is_active': True
        }

        response = self.client.put(
            url,
            data,
            format='json'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        product.refresh_from_db()

        self.assertEqual(
            product.name,
            'Paracetamol 500mg'
        )

        self.assertEqual(
            product.price,
            Decimal('65.00')
        )

        self.assertEqual(
            product.description,
            'Analgésico y antipirético de 500mg'
        )

    # 6. Eliminar un producto
    def test_eliminar_producto(self):

        category = Category.objects.create(
            name='Medicamentos'
        )

        product = Product.objects.create(
            name='Paracetamol',
            category=category,
            description='Analgésico',
            price='50.00',
            is_active=True
        )

        url = reverse(
            'products-detail',
            kwargs={'pk': product.id}
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        self.assertEqual(
            Product.objects.count(),
            0
        )
