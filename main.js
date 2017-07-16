  function getMenu(cat){
  $.ajax({
    method: "GET",
    url: "test.php?category="+cat,
    data: { function: 'getMenu' },
    cache: false
  })
  .done(function( msg ) {
    var parsed = JSON.parse(msg);
    var menu = parsed[cat];
      var output = '';
      for(var i in menu){
         var id = menu[i].id;
         var name = menu[i].name.toLowerCase();
         var price = menu[i].price;
         output += '<div class="menu-item-con"><div class="menu-item" id="'+id+
         '" onclick="addOrder(\''+id+'\',\''+name+'\',\''+
         price+'\')"><div class="name-con"></div><div class="item-desc">'
            +name+' (P'+price+
            ')</div></div></div>';
}
    $('.super-inner-right').html(output);
    $('#categ').html(cat);
  });
  }


  function randomString(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      for(var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }

  function showOrders(){
    var theresult = "";
    var thetotal = "";
    var theorders = JSON.parse(localStorage.orders);
    for(var f=0;f<theorders.length;f++) {
    theresult += '<div class="itembox" id="'+theorders[f][0]+'"><div class="alignleft"><span class="plus" onclick="popUp(\''+theorders[f][0]+'\',\''+theorders[f][1]+'\',\''+theorders[f][2]+'\',\''+f+'\')">+</span>&nbsp&nbsp'+theorders[f][1].toLowerCase()
    +' ('+theorders[f][3]+')</div><div class="alignright">'+theorders[f][2]
    +'.00 &nbsp<span class="minus" onclick="removeOrder(\''+f+'\',\''
    +theorders[f][2]
    +'\')">-</span></div><div style="clear: both;"></div></div>';
      if(theorders[f][4].length > 0) {
        for(var g=0;g<theorders[f][4].length;g++) {
          theresult += '<div class="itembox" id="'+theorders[f][4][g][0]+'"><div class="alignleft">--'+theorders[f][4][g][1].toLowerCase()
          +' ('+theorders[f][4][g][3]+')</div><div class="alignright">'+theorders[f][4][g][2]
          +'.00 &nbsp<span class="minus" onclick="removeAddOn(\''+f+'\',\''
          +g+'\',\''
          +theorders[f][4][g][2]+'\')">-</span></div><div style="clear: both;"></div></div>';
        }
      }
      }
    theresult += '<div class="focus" tabindex="1"></div>';
    thetotal = "Php "+localStorage.total+".00";
    $('#bill').html(theresult);
    $('#bill-total').html(thetotal);
  }


  function popUp(orderid,ordername,orderprice,orderpos) {
    modal.style.display = "block";
    localStorage.origid = orderid;
    localStorage.origpos = orderpos;
    localStorage.change = 0;
    var orders = JSON.parse(localStorage.orders);
    if (orderid.indexOf('-') < 0) {
    if(!localStorage.addCode){
      localStorage.addCode = 1;
    }
    var addCode = localStorage.addCode;
    var newId = orderid.toString() + "-" + addCode.toString();
    orders[orderpos][0] = newId;
    localStorage.addCode ++;
    }
    localStorage.orders = JSON.stringify(orders);
    showOrders();
  }

  function addOn(orderid,ordername,orderprice) {
    var orders = JSON.parse(localStorage.orders);
    var parentId = localStorage.origid;
    var parentPos = localStorage.origpos;
    var addlist = [orderid,ordername,orderprice,1];

    var counter = 0;
    var exist;
    for(var x=0;x<orders[parentPos][4].length;x++){
      if($.inArray(orderid, orders[parentPos][4][x]) !== -1) {
        counter ++;
        exist = x;
      }
    }
    if (counter > 0) {
      orders[parentPos][4][exist][3] += 1;
      var orderSum = parseInt(orders[parentPos][4][exist][2]);
      orderSum += parseInt(orderprice);
      var orderTotal = parseInt(localStorage.total);
      orderTotal += parseInt(orderprice);
      orders[parentPos][4][exist][2] = orderSum.toString();
      localStorage.total=orderTotal.toString();
    }
    else {
      var toPush=[orderid,ordername,orderprice,1];
      orders[parentPos][4].push(toPush);
      var orderTotal = parseInt(localStorage.total);
      orderTotal += parseInt(orderprice);
      localStorage.total=orderTotal.toString();
    }

    if(orders) {
    localStorage.orders = JSON.stringify(orders);
    showOrders();
    }
    localStorage.change = 1;
  }



  function addOrder(orderid,ordername,orderprice) {
    if(!localStorage.orderid) {
      localStorage.orderid = randomString(11);
      var orders=[];
      localStorage.total="0";
    }
    else {
      orders = JSON.parse(localStorage.orders);
      var total = localStorage.total;
    }
    var counter = 0;
    var exist;
    for(var x=0;x<orders.length;x++){
      if($.inArray(orderid, orders[x]) !== -1) {
        counter ++;
        exist = x;
      }
    }
    if (counter > 0) {
      orders[exist][3] += 1;
      var orderSum = parseInt(orders[exist][2]);
      orderSum += parseInt(orderprice);
      var orderTotal = parseInt(localStorage.total);
      orderTotal += parseInt(orderprice);
      orders[exist][2] = orderSum.toString();
      localStorage.total=orderTotal.toString();
    }
    else {
      orders.push([orderid,ordername,orderprice,1,[]]);
      var orderTotal = parseInt(localStorage.total);
      orderTotal += parseInt(orderprice);
      localStorage.total=orderTotal.toString();
    }

    if(orders) {
    localStorage.orders = JSON.stringify(orders);
    showOrders();
    }
     $('.focus')[0].focus();
  }

  function removeOrder(pos,price) {
    orders = JSON.parse(localStorage.orders);
    if(orders[pos][4]){
      for(var h=0;h<orders[pos][4].length;h++) {
        localStorage.total=(parseInt(localStorage.total)-parseInt(orders[pos][4][h][2])).toString();
      }
    }
    orders.splice(pos,1);
    localStorage.orders = JSON.stringify(orders);
    localStorage.total=(parseInt(localStorage.total)-parseInt(price)).toString();
    showOrders();
  }

  function removeAddOn(pos, poss,price) {
    orders = JSON.parse(localStorage.orders);
    orders[pos][4].splice(poss,1);
    localStorage.orders = JSON.stringify(orders);
    localStorage.total=(parseInt(localStorage.total)-parseInt(price)).toString();
    showOrders();
  }

  function clearOrder() {
    localStorage.clear();
    $('#bill').html("No Orders!");
    $('#bill-total').html("Php 00.00");
  }

  
  if(localStorage.orderid){
    showOrders();
  }
  else{
    $('#bill').html("No Orders!");
  }
  getMenu('SPECIALS');


  //modal
var modal = document.getElementById('myModal');
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      if (localStorage.change == 0) {
        var orders = JSON.parse(localStorage.orders);
        var orderpos = localStorage.origpos;
        var origid = localStorage.origid;
        orders[orderpos][0] = origid;
        localStorage.orders = JSON.stringify(orders);
        showOrders();
      }
    }
}