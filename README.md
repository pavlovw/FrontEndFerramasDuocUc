# Ferramas Frontend
El  FrontEndFerramasDuocUc es la interfaz de usuario del proyecto Ferramas, desarrollado como parte del curso en Duoc UC. Este frontend se comunica con una API que sigue los principios de Arquitectura Limpia (Clean Architecture), asegurando una separación clara de responsabilidades y facilitando la mantenibilidad y escalabilidad del sistema.
## Requisitos

- Node.js v22.14.0
- npm v10.9.2

## Instalación

1. Clonar el repositorio:
```bash

## Explicacion
🔗 Comunicación con la API
La aplicación consume servicios desde una API externa, principalmente para:

Obtener productos.

Iniciar transacciones de compra (posiblemente con integración a Transbank).

Gestionar suscripciones o monedas (como Dollar).

Esta comunicación se realiza a través de servicios o hooks definidos en la carpeta services/, utilizando axios o fetch.

🖼️ Funcionalidades esperadas
Visualización de productos disponibles.

Registro e inicio de sesión de usuarios (si aplica).

Flujo de compra: selección de productos → carrito → pago.

Integración con pasarela de pagos (Transbank u otra).

Dashboard o interfaz administrativa (si corresponde).
