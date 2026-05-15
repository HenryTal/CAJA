# CAJA
La idea de este proyecto ha surgido por la necesidad que ha crecido junto con el mercado de videojuegos, cuando se piensa en comprar un videojuego un gran porcentaje de personas compran directamente la primera o segunda oferta que encuentran en Internet ya que el buscar el menor precio suele tomar demasiado tiempo en navegar de una tienda a otra para después de comprar el videojuego con el menor precio encontrado un amigo, conocido o la persona misma encuentre una oferta mejor en una tienda un poco oculta o que se ignoró a la hora de buscar.
Para evitar situaciones como la anteriormente dicha surgió este proyecto, un sitio en el que busca automáticamente en una amplia variedad de tiendas el precio más económico para el videojuego que se desea comprar, esto hace que ahorrar sea más sencillo porque ahora no es necesario navegar de un sitio a otro perdiendo demasiado tiempo buscando el mejor precio.

El objetivo principal de este proyecto es crear un sitio web donde encontrar el juego que quieras comprar a un precio muy económico sin perder tanto tiempo navegando por Internet. También crear un sitio web donde tener una lista de todos los juegos que haya comprado o que piensa comprar y descubrir nuevos juegos o juegos poco conocidos, pero entretenidos.
Al cumplir con esos objetivos se ayuda a aquellas personas que no tengan el tiempo libre suficiente como para ahorrar en los juegos que compran.

# Instalación y Configuración
Para la instalación de este proyecto en un servidor es necesario tener instalado en el sistema NodeJS con la versión 22.12.0 o superior desde su Página Oficial (https://nodejs.org/es/download).
 
Un servidor de base de datos en MySQL es recomendable que este en el puerto 3306 en el caso de que se quiera usar una base de datos con un puerto ya asignado se deberá especificar en el archivo de variables de entorno “.env” del proyecto.
 
Una vez instalado y configurado lo anterior se debe descargar el proyecto desde el siguiente Repositorio GitHub (https://github.com/HenryTal/CAJA) igualmente es necesario descargar el archivo de variables de entorno “.env” adjuntado a este documento en el Aula Virtual este archivo debe estar en la carpeta raíz del proyecto. 
 
Cuando se haya clonado el repositorio o extraído los archivos para iniciarlo se debe ejecutar el archivo llamado “start.bat” esto abrirá una consola y el navegador en la página de inicio del proyecto.
 
Cuando todo el proyecto haya terminado de cargar debería de aparecer en el navegador la página de inicio cargando los juegos que va a mostrar, esto puede demorar un poco si es la primera vez que se inicia el proyecto ya que necesita buscar en las APIs toda la información necesaria y guardarla en base de datos.
