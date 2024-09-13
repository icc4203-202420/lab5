# Tips para resolver los ejercicios propuestos.

Durante el laboratorio 5 del día Martes 10 de Septiembre, durante la clase resolvimos en conjunto los puntos 1, 2, 3, 6 y 7.

Respecto al punto 4, alcanzamos a colocar el input dentro del mapa, de igual forma, en este archivo estaremos enfocados solamente en los puntos 4 desde el inicio y 5, vamos allá.

Si recordamos lo visto en el laboratorio, el hook *useRef* nos permite almacenar en una variable una referencia a un elemento HTML, siguiendo esta logica, no este hook vamos a poder acceder al input y colocarlo dentro del mapa.

```javascript
const mapNodeRef = useRef();
  ...
const inputNodeRef = useRef();

...
  return (
    <>
      <input
        ref={inputNodeRef}
        type="text"
        placeholder="Buscar ciudad"
        onKeyDown={handleSearch}
        onChange={handleFilter} // Filtra mientras escribe el usuario
      />
      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
```

En primer lugar, nuestro componente tiene que retornar tanto el *div* donde se renderizará el mapa, como el *input* para hacer la busqueda, si nos fijamos, ambos elementos mediante la propiedad *ref*, estan siendo referenciados (almacenados) en las variables *mapNodeRef* y *inputNodeRef*.

- nota: Para acceder o alterar el valor de un hook *useRef*, tenemos utilizar su atributo *.current*

Si nos fijamos en el input, tenemos 2 eventos importantes.
*onKeyDown* el cual será el encargado de realizar la busqueda cuando el usuario apriete la tecla *Enter* y *onChange*, la cual se llama cada vez que el valor del *input* cambia, esta sera la encargada de filtrar los *Market*

Ambas funciones son llamadas con un parametro por un objeto  *event*, con dicho objeto nosotros podemos acceder a diferentes cosas, una de ellas es el mismo elemento HTML que llama a la función.

```javascript
const handleSearch = (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    // const inputValue = event.target.value
    const inputValue = inputNodeRef.current.value


    
    // Si nos fijamos, con event.key podemos verificar que tecla se esta pulsando, la logica aquí es que si la tecla no es Enter, que no haga nada.

    // Para obtener el valor del input, necesitamos referenciar al elemento HTML, lo podemos hacer mediante event.target, o bien con el useRef que teniamos, inputNodeRef.current

    /*
    TODO: Es aquí donde deben implementar la logica para que el buscador funcione.
    */
    
}
```

Para que el buscador funcione correctamente, la logica es sencilla, en primer lugar, nececitamos tener en algun hook de estado, la lista de ciudades, en clases para dicho punto teniamos el siguente estado.

```javascript
const [cities, setCities] = useState([]);
const [filteredCities, setFilteredCities] = useState([]);
```

Un listado de ciudades en *cities* y para efectos del punto 5,
*filteredCities* que inicialmente va a contener todas las ciudades de *cities*.

Por ahora quedemosnos con *cities*. Para que el buscador funcione, en *handleSearch* lo que tenemos que hacer es verificar si el valor almacenado en el input se encuentre en la lista de *cities*, para que el usuario pueda buscar sin tener que calzar con las mayusculas, pueden utilizar el metodo de Strings .toLowerCase().

En el caso de que la busqueda sea exitosa, el mapa de google, mediante el metodo .toPan(position), centra dicho mapa en la posición entregada.

- nota: position debe ser un objeto de este tipo **{lat, lng}**

Respecto al filtro, la logica es parecida a la anterior.
Cada vez que el usuario escriba o borre algo en el *input*, se tiene que filtrar la lista. Como vimos anteriormente, en el *input* del componente, en el atributo *onChange* se gatillará, cada vez que pase esto, y llamará a la función *handleFilter*

```javascript
  const handleFilter = (event) => {
    const inputValue = event.target.value.toLowerCase();
    
    // En inputValue tenemos almacenado lo que el usuario ha escrito hasta el minuto input 
    //Por que?, porque con event.target obtenemos el elemento HTML que llamó a esta función, y con .value tenemos su valor.

    /* TODO: Ahora lo que tenemos que hacer, es
    mediante la lista cities, quedarnos con las ciudades que partan/contengan lo almacenado en el input, con esta nueva lista de ciudades, setearlas en nuestro estado
    filteredCities
    */
  };

```

Finalmente, al crear los *Markets*, los tenemos que crear con la lista *filteredCities*, de esta manera, solo aparecerá en el mapa los filtrados, que en su minuto, si el input está vacío, serán los mismos de *cities*.

- notas: Conviente crear una funcion encargada de generar los markets, dada una lista de ciudades.

```javascript

const generateMarkers = (cities) => {
    return cities.map(({ name, position }) => {
      // crear los markets
    });
};


  // Luego 

useEffect(() => {
    if (!libraries || !mapRef.current) {
      return;
    }
    
    // ...

    if (markerCluster.current) {
      markerCluster.current.clearMarkers();
    } // se limpian los Markets anteriores para posteriormente crear los nuevos

    const markers = generateMarkers(filteredCities)
    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
}, [filteredCities]);

```

Si nos figamos, el *useEffect* al tener en su arreglo de dependecias a *filteredCities*, se ejecutará cada vez que *filteredCities*, lo cual será cada vez que el usuario manipule el *input*, debido a que en el trigger *onChange*, se esta llamando a una función que cambia el valor de *filteredCities*.


Como punto final, para que el input esté dentro del mapa y no afuera.

```javascript
// con el atributo .controls del Mapa, podemos hacer un push de un elemento HTML, en este caso estamos insertando inputNodeRef.current, que es el input que retorna nuestro componente.


//Respecto a donde se posicionara, dependemos de lo que le entregemos a .control[]

//en el README.md aparece la explicación de que es extactamente ControlPosition

mapRef.current.controls[ControlPosition.TOP_RIGHT].push(inputNodeRef.current);
```

Les recomiendo que resuelvan estos ejecricios propuestos, entender el codigo, para esto es util preguntarse
- Que está pasando?
- Por qué está pasando?

y una vez realizado, usando la misma lógica, impitarlo para el proyecto 1.4.

Espero que les haya quedado un poco más claro como implementar la busqueda y el filro en el buscador.