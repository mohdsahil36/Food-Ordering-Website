import {useState,useEffect} from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';


const AvailableMeals = () => {
  const [meals,setMeals]=useState([]);
  const [isLoading,setisLoading]=useState(true);
  const [httpError,sethttpError]=useState();
  useEffect(()=>{

   const fetchMeals=async()=>{

    const response=await fetch('https://react-http-efc85-default-rtdb.firebaseio.com/meals.json');

    if(!response.ok){
      throw new Error('Something went wrong!');
    }

    const responseData=await response.json();
    const loadedMeals=[];

    for(const key in responseData){
      loadedMeals.push({
        id:key,
        name:responseData[key].name,
        description:responseData[key].description,
        price:responseData[key].price
      })
    }
    // console.log("Values are:",loadedMeals);
    setMeals(loadedMeals);
    setisLoading(false);
   }

   fetchMeals().catch(error=>{
    setisLoading(false);
    sethttpError(error.message);
   });
   
  },[]);

  if(isLoading){
    return <section className={classes.MealsLoading}>
      Loading.....
    </section>
  }

  if(httpError){
    return <section className={classes.mealsError}>{httpError}</section>
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;