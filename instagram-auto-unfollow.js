/* Kullanıcı ve html bilgileri */
var auto_unfollow_time = 3000;
var url = window.location.href; /* URL alınıyor */
var username = url.split("/")[3]; /* Kullanıcı adı url`dan otomatik çekiliyor */

var followers_button = "a[href='/"+username+"/followers/']"; /* Takip edenler butonu bilgisi */
var followers_list_class = "._4gt3b"; /* Takip edenlerin listelendiği div`in class değeri */
var followers_count_class = "._bkw5z"; /* Takip edenlerin sayısı class değeri */
var followers_count = $(followers_button + " " + followers_count_class).text(); /* Takip edenlerin sayısı */

var following_button = "a[href='/"+username+"/following/']"; /* Takip edilenler butonu bilgisi */
var following_list_class = "._4gt3b"; /* Takip edilenlerin listelendiği div`in class değeri */
var following_count_class = "._bkw5z"; /* Takip edilenlerin sayısı class değeri */
var following_count = $(following_button + " " + following_count_class).text(); /* Takip edilenlerin sayısı */

var following_modal_title_class = "._q44m8"; /* Takip edilenlerin açılı pencere title class değeri */

var modal_users_ul_li = followers_list_class + " ul:first-child li";  /* Açılan penceredeki 1 ci ul elementinin li`lerini seç */

var followers_order_array = {};  /* İzleyen kullanıcıların arraydaki sırası */
var followers_name_array = {};  /* İzleyen kullanıcıların arraydaki ismi */

function create_followers_array()
{
/* İzleyen kullanıcılar için arrayları oluştur */
for(var i=0;i<=$(modal_users_ul_li).length;i++)
{
followers_order_array[i] = $(modal_users_ul_li +":eq("+i+") a").text();  /* Her bir kullanıcı için arraya li elementine göre sayı ata */
followers_name_array[followers_order_array[i]] = followers_order_array[i];  /* Her bir arraydaki sayının li elementine göre kullanıcı adı ekle */
}
}

function is_user_follow_me(username_value)
{
/* Sorgulanan kullanıcı adı izleyen kullanıcılar arasında var mı */
if(!(username_value in followers_name_array)) {
$("a[href='/"+username_value+"/']").parents().eq(4).find("button").not("._2hpcs")[0].click(); /* Takip etmeyenlerin aboneliğinden çık (not ile yeniden abone olma tuşuna basmayı engelle) */
$("a[href='/"+username_value+"/']").append("<font color='red'>	✖ unfollowed</font>"); /* Takipte olmayanları göster */
$("#unfollowed_users_count").text(parseInt($("#unfollowed_users_count").text()) + parseInt(1)); /* Toplam takipten çıkarılan kullanıcıların sayısını güncelle */
}else{
$("a[href='/"+username_value+"/']").append("<font color='green'> ✔ is following you</font>"); /* Takipte olmayanları göster */
}
}

function unfollow_all_non_followers()
{
var i = 0;
var counter_interval = setInterval(function(){
is_user_follow_me($(modal_users_ul_li +":eq("+i+") a").text());
i++;
if(i > $(modal_users_ul_li).length) {
	clearInterval(counter_interval);
	alert("Finished ! Total : " + $("#unfollowed_users_count").text() + " unfollowed users");
}
}, auto_unfollow_time);
}

function step1(){
/* Takip edenler butonuna tıklat */
$(followers_button)[0].click();
var followers_scroll_interval = setInterval(function(){
var followers_list = $(followers_list_class);
followers_list.scrollTop(followers_list.prop("scrollHeight"));
if($(modal_users_ul_li).length >= followers_count) {
clearInterval(followers_scroll_interval); /* İntervalı temizle */
create_followers_array(); /* İzleyenler arrayını oluştur */
step2(); /* İkinci etapa geç */
}
},100);
}

function step2(){
/* Takip edilenler butonuna tıklat */
$(following_button)[0].click();
var following_scroll_interval = setInterval(function(){
var following_list = $(following_list_class);
following_list.scrollTop(following_list.prop("scrollHeight"));
if($(modal_users_ul_li).length >= following_count) {
clearInterval(following_scroll_interval); /* İntervalı temizle */
following_list.scrollTop(0); /* Scroll`u en yukarı al */
$(following_modal_title_class).append("<font color='red'> <span id='unfollowed_users_count'>0</span> unfollowed</font>"); /* Toplam takipten çıkarılan kullanıcıları göster */
unfollow_all_non_followers(); /* Otomatik abonelikten çıkarma fonksionunu çağır */
}
},100);
}

function start(){
step1();
}

start();
