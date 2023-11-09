let addFoodBtn = document.getElementById('addFoodBtn');
let foodList = document.querySelector('.foodList');
let foodDiv  = document.querySelectorAll('.foodDiv')[0];

addFoodBtn.addEventListener('click', function(){
    let newFoods = foodDiv.cloneNode(true);
    let input = newFoods.getElementsByTagName('input')[0];
    input.value='';
    foodList.appendChild(newFoods);
});