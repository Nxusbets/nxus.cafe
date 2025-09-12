# Firebase Setup Instructions - Nxus Café

## 🚀 Configuración de Firebase

Tu proyecto ya está configurado con las credenciales de Firebase para **Nxus Café**. Aquí tienes las instrucciones completas:

### ✅ Credenciales Configuradas

Las siguientes credenciales ya están configuradas en tu proyecto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBSGMmZ6jdtx4H_ScUryf6UUC3cGTyYCvI",
  authDomain: "nxuscafe.firebaseapp.com",
  projectId: "nxuscafe",
  storageBucket: "nxuscafe.firebasestorage.app",
  messagingSenderId: "358732108778",
  appId: "1:358732108778:web:d12d726a4317e881eb9893"
};
```

### 🔧 Verificación de Configuración

1. **Archivo `.env`**: ✅ Configurado con credenciales reales
2. **Archivo `firebase.ts`**: ✅ Usando variables de entorno
3. **Proyecto Firebase**: ✅ `nxuscafe` creado y configurado

### 📊 Poblar Base de Datos

Para poblar tu base de datos con productos de ejemplo:

1. **Inicia la aplicación:**
   ```bash
   npm run dev
   ```

2. **Abre la consola del navegador** (F12 → Console)

3. **Ejecuta el comando:**
   ```javascript
   populateProducts()
   ```

4. **Verifica los resultados** en la consola

### 📁 Estructura de Base de Datos

#### Colecciones principales:

- **users**: Perfiles de usuario
- **products**: Catálogo de productos (12 productos de ejemplo)
- **orders**: Pedidos realizados

#### Productos incluidos:
- ☕ **Cafés**: Espresso, Americano, Latte, Cappuccino, Mocha
- 🧊 **Bebidas Frías**: Frappé de Caramelo
- 🍰 **Postres**: Cheesecake, Red Velvet, Muffin
- 🥐 **Repostería**: Croissant de Almendras
- 🍵 **Tés**: Matcha Latte
- 🥤 **Saludables**: Smoothie de Mango

### 🎯 Próximos Pasos

1. **Probar autenticación:**
   - Regístrate como nuevo usuario
   - Verifica que se guarde en Firebase Auth
   - Revisa Firestore para el perfil de usuario

2. **Probar pedidos:**
   - Crea un pedido desde la página de menú
   - Verifica que se guarde en Firestore
   - Revisa el panel de meseros

3. **Probar sistema QR:**
   - Accede al panel de meseros (`/waiter`)
   - Escanea códigos QR de productos
   - Verifica que se agreguen al pedido

### 🔍 Verificar Conexión

Para verificar que Firebase esté conectado correctamente:

1. Abre las **Firebase Console** en [console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona el proyecto **nxuscafe**
3. Ve a **Authentication** → **Users** (deberías ver usuarios registrados)
4. Ve a **Firestore Database** → **Data** (deberías ver productos y pedidos)

### �️ Solución de Problemas

#### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que el archivo `.env` tenga las credenciales correctas
- Reinicia el servidor de desarrollo

#### Error: "Missing or insufficient permissions"
- Ve a Firebase Console → Firestore Database → Rules
- Asegúrate de que las reglas permitan operaciones de lectura/escritura

#### Error: "Código QR no válido"
- Verifica que estés escaneando códigos QR generados por la aplicación
- Los códigos QR contienen datos JSON con `type: 'product'`

### 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs de la consola del navegador
2. Verifica la conexión a internet
3. Confirma que las credenciales en `.env` sean correctas
4. Consulta la [documentación oficial de Firebase](https://firebase.google.com/docs)

---

**¡Tu sistema Nxus Café está listo para usar!** 🎉
