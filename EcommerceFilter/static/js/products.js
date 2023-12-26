// Toggle Nav menu


// A Naive thing
function toggle_nav_menu(){
    var obj = document.getElementById('nav-ham-menu');
    var obj2 = document.getElementById('cross-icon-nav-ham')
    var obj3 = document.getElementById('container')
    var toggle_nav = document.getElementById('toggle-nav')
    if (obj.contains(obj2)){
        obj.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>'
        toggle_nav.style.display = 'none'
        try{
            obj3.classList.remove('fade-out')
        }catch{}
    }else{
        obj.innerHTML = '<i id="cross-icon-nav-ham" class="fa fa-times"></i>'
        toggle_nav.style.display = 'block'
        try{
            obj3.classList.add('fade-out')
        }catch{}
    }
}
// End Toggle Nav menu

// Hidden filter -> Process was simple
    // step1 -> If current screen size <= 775px we just cut and paste desktop filter section to mobile filter section
    // Again -> If current screen size > 775px we cut mobile filter section and paste it to desktop filter section

// The reason we're cutting because it will cause error if two elements are having save id's

function enable_hidden_filter(action){

  // Was complex enough to think about it.

  var obj = document.getElementById('hidden-filter-mobile') 
  var main_filter_container = document.getElementById('main-filter-container')
  var filter_contents = document.getElementById('filter-contents')
  var obj3 = document.getElementById('container')
  var close_filter = document.getElementById('close-filter')

      if (action==true){
        obj.style.display = 'block';
        obj.appendChild(filter_contents)
        obj3.classList.add('fade-out')
        close_filter.classList.remove('d-none')
      }
      else{
        main_filter_container.appendChild(filter_contents);
        obj.style.display = 'none'
        obj3.classList.remove('fade-out')
        close_filter.classList.add('d-none')
      }
}

window.onresize = function(){
  if (screen.width > 775){
    enable_hidden_filter(false)
  }
}

// End Hidden filter

// Search query

let search_query = ''

function search_query_input(){
    search_query = $('#nav-search').val()

    trigger()
}

// To update tags and refinements

let brands = new Set(); // Set for storing


let filter_box = document.querySelectorAll('.filter-box');

// If any tag checkbox is checked or unchecked , this function will invoke and will add or remove tags

filter_box.forEach((item) => {
  item.addEventListener('click', function(){

    var child = item.children[0].children

    if (child[1].checked && !brands.has(child[0].innerHTML)){
      brands.add(child[0].innerHTML)
      trigger()
    } 
    else if (child[1].checked && brands.has(child[0].innerHTML)){
      brands.delete(child[0].innerHTML)
      trigger()
    }
  })
})

// category filter 

var categories = document.querySelectorAll('.category')
var current_category = ''
categories.forEach( (item) => {

  item.addEventListener('click', function(){

    var sub_itm = document.querySelectorAll('.category')
    sub_itm.forEach( (sub_item) => {
      sub_item.classList.remove('selected')
    })

    if (current_category !== item.getAttribute('cat_id')){
        current_category = item.getAttribute('cat_id')
        item.classList.add('selected')
    }else{
        item.classList.remove('selected')
        current_category = ''
    }

    trigger()
    
  })

})

// end category filter

// sort by price 

let sort_by_price = false

function change_sorting(){
  var sort_icon = document.getElementById('sort-icon')

  if (sort_by_price){
    sort_icon.classList.remove('fa-sort')
    sort_icon.classList.add('fa-sort-up')
    sort_by_price = false
  }
  else{
    sort_icon.classList.remove('fa-sort')
    sort_icon.classList.remove('fa-sort-up')
    sort_icon.classList.add('fa-sort-down')
    sort_by_price = true
  }

  trigger()

}

// end sort by price

// Change price range

let current_price_range = [0, 10000]

function change_price(){
    current_price_range[0] = $('#p-min-range').val();
    current_price_range[1] = $('#p-max-range').val()
    trigger()
}

// Warranty

var warranty_year = 0

function warranty(year){
    warranty_year = year
    trigger()
}

// Seller
let sellers = new Set(); // Set for storing


let seller_box = document.querySelectorAll('.seller-box');

// If any tag checkbox is checked or unchecked , this function will invoke and will add or remove tags

seller_box.forEach((item) => {
  item.addEventListener('click', function(){

    var child = item.children[0].children

    if (child[1].checked && !sellers.has(child[1].value)){
      sellers.add(child[1].value)
      trigger()
    }
    else if (child[1].checked && sellers.has(child[1].value)){
      sellers.delete(child[1].value)
      trigger()
    }

  })
})

// Trigger section, it will be responsible for filtering out the page 

function trigger(){

    document.getElementById('loader-product-page').style.display = 'flex'

    // Sending request
    let req = $.ajax({
        type:'post',
        url:'/',
        data:{
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            sort_by_price:sort_by_price,
            current_category:current_category,
            refinements: Array.from(brands),
            price_range: current_price_range,
            warranty: warranty_year,
            search_query:search_query,
            sellers: Array.from(sellers)
        }
    })

    // On success
    req.done(function(response){
        // Update product template
        document.getElementById('loader-product-page').style.display = 'none'
        $('#products-grid').html(response.template)

        // Resetting csrf token for next filter
        var token  = document.getElementsByName('csrfmiddlewaretoken')[0]
        token.value = response['token']
    })

}

// End Trigger section