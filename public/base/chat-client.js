var _blockChat = ''+
'    <div class="fhgt45a4fgsl-chat-popup" id="fhgt45a4fgsl-form-chat">'+
'          <div class="fhgt45a4fgsl-cont-top">'+
'            <div class="fhgt45a4fgsl-cont-top-title"><h1>Ejecutivo Virtual</h1></div>'+
'            <div class="fhgt45a4fgsl-cont-top-action">'+
'              <ul>'+
'                <li><a href="#" class="minimize"><span>-</span></a></li>'+
'                <li><a href="#" class="close" onclick="fhgt45a4fgslCloseForm()"><span>X</span></a></li>'+
'              </ul>'+
'            </div>'+
'          </div>'+
'          <div class="fhgt45a4fgsl-cont-message" id="id-fhgt45a4fgsl-cont-message"><iframe aria-hidden="true" tabindex="-1" sandbox="allow-scripts allow-forms" frameBorder="0" src="'+bElisa.base_url+'/widget/belisa?i='+bElisa.client_id+'" scrolling="no"></iframe></div>'+
'    </div>'+
'    <button class="fhgt45a4fgsl-open-button" onclick="fhgt45a4fgslOpenForm()">Chat</button>';
var x = document.createElement("div");
x.id = "fhgt45a4fgsl-block-chat";
x.innerHTML = _blockChat;
document.body.appendChild(x);

var head = document.getElementsByTagName('HEAD')[0];  
var link = document.createElement('link'); 
link.rel = 'stylesheet';  
link.type = 'text/css'; 
link.href = bElisa.base_url+'/base/chat-client.css';
head.appendChild(link);

/*
*chat  debe iniciar solicitando datos, nombre, rut, telefono/email
*captcha
*/
function fhgt45a4fgslOpenForm() {document.getElementById("fhgt45a4fgsl-form-chat").style.display = "block";}
function fhgt45a4fgslCloseForm() { document.getElementById("fhgt45a4fgsl-form-chat").style.display = "none";}


