# Plugin para la herramienta [Ethereum Grid](https://grid.ethereum.org/) que gestiona un nodo Geth conectado a la Blockchain Federal Argentina (BFA) sobre la Testnet. 

## Description
Utilizando Ethereum Grid junto con este plugin podemos gestionar rapidamente el inicio, sincronizacion y gestión de los parámetros básicos utilizados con [geth](https://geth.ethereum.org/) para el establecimiento de un "client" Ethereum con acceso al ambiente de Testnet de la Blockchain Federal Argentina. Al ser Ethereum Grid una herramienta visual la gestión de parametros a traves de una UI.

La herramienta [Ethereum Grid](https://grid.ethereum.org/) es una interesante herramienta que más alla de encontrarse aún en una etapa de evolución nos facilita la ejecución de diferentes herramientas del ecosistema Ethereum.

<div align="center">
  <a href="https://youtu.be/v_Fpb-KuHU0"><img src="https://img.youtube.com/vi/v_Fpb-KuHU0/0.jpg"></a>
</div>

## Prerequisitos

- Proceder a la descarga e instalación de la herramienta Ethereum Grid desde esta página [https://grid.ethereum.org/](https://grid.ethereum.org/).


## Instalación del plugin sobre Ethereum Grid

- Realizar una copia de seguridad del archivo plugins.json previo a su modificación
  <Path de instalación>resources\app\ethereum_clients\client_plugins\plugins.json

- Editar el archivo *plugins.json* e incorporar el siguiente elemento

~~~
  {
    "name": "BFA.testnet",
    "displayName": "BFA Testnet",
    "type": "client",
    "author": {
      "name": "Gonzalo Bellino",
      "email": "",
      "address": ""
    },
    "location": "https://github.com/gonzalobellino/grid-bfa-plugin"
  }
~~~

Tip: Ejemplo de archivo plugins.json modificado en este [link](plugins.json)

## Uso

Luego de iniciar [Ethereum Grid ](https://grid.ethereum.org/) deberiamos visualizar ua lista de herramientas y clientes disponibles para ser gestionadas, incluida una opción nueva denominada "BFA Testnet"

![Pantalla principal](bfatestnet.jpg)

Desde la opción BFA Testnet ademas de iniciar el cliente Geth pre configurado también podremos utilizar un explorador de bloques y un cliente GraphQL (se recomienda aguardar a la sincronización de la cadena para su uso)

Utilizando la pestaña "settings" se pueden observar los distintos parámetros de personalización para ajustar la ejecución del cliente Geth.

![Configuración](configuration.jpg)

También es posible visualizar la terminal con información de "logging"

![Logging](terminal.jpg)


## Directorio de destino default de la base de datos 

Por default el directorio se creara segun el sistema operativo de destino en los siguientes directorios

 - Linux --> ~/.BFA/testnet
 - Windows --> env.APPDATA/BFA/testnet (env.APPDATA ej: --> c:/Users/Guest/AppData/Roaming/)
 - darwin --> ~/Library/BFA/testnet