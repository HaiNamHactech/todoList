 // ============================= CÁC BIẾN KHAI BÁO TOÀN CỤC CHO CHƯƠNG TRÌNH =========================\\
 let box_up_create = $(".box_up_Create");
 let boby = $(".list-tasks");
 let listStask = (localStorage.getItem("listStask") === null) ? [] : JSON.parse(localStorage.getItem("listStask"));
 let local_count_stask_active = $(".tasks-new .num-task");
 let local_count_stask_complete = $(".tasks-complete .num-task");
 let check_type_display ;
 let objByEdit;
 let input_Popup = $(".txt-todo");
 //================================================== END =============================================\\
 
 // ==============================  lấy và hiện thị ngày hiện tại ==========================\\
 let today = new Date();
 let d = today.getDate();
 let t = today.getMonth()+1;
 let y = today.getFullYear();
 let nowDay = d + "/" + t + "/" + y;
 $("#date-time").text(nowDay);
 // =============================================================================================\\
 
 // ====================================== hiện popup ============================================\\
 $(".fa-plus-circle").click(()=>{
     box_up_create.slideDown();
 })

 // ========================================  ẩn  popup khi click ra ngoai popup  ================ \\ 
 $(document).click(function (e){
     if (box_up_create.is(e.target) && box_up_create.has(e.target).length === 0)
     {
         box_up_create.slideUp();
     }
 });

 // ========================================= bật tắt color các kiểu hiện thị =============================== \\
 $(document).on('click','.footer-todo > button',function ()  {
     $(".footer-todo > button").removeClass('active');
     $(this).addClass('active');
 })
 
 //========================================== hàm render html ============================================\\
 function render(listStasks,tbody){
     let stk_html = listStasks.map(item => {
         if(item.Status === 1){
             return  (`
                 <li  class="task s_${item.Stask_ID}">
                     <div class="btn-complete_stack">
                         <i data-staskid="${item.Stask_ID}" data-status="${item.Status}" class="far fa-circle"></i>
                     </div>
                     <p>${item.Stask}</p>
                     <div class="action a_${item.Stask_ID}">
                         <i data-edit_id="${item.Stask_ID}" class="far fa-edit"></i>   
                     </div>
                 </li> 
             `)   
         }
         else{
             return  (`
                 <li class="task s_${item.Stask_ID}">
                     <div class="btn-complete_stack">
                         <i data-staskid="${item.Stask_ID}" data-status="${item.Status}" class="far fa-check-circle"></i>
                     </div>
                     <p class="value-stask-complete">${item.Stask}</p>
                     <div class="action">
                         <i data-delete_id="${item.Stask_ID}" class="far fa-trash-alt"></i>
                     </div>
                 </li>
             `)
         }
     });
     let listStasks_html = stk_html.join(' ');
     if(tbody){
         tbody.html(listStasks_html); 
     } 
 }

 // ========================================= thêm stask =================================================\\
 $(".btn-add-todo").click(()=>{
     let txt = input_Popup.val();
     let id;
         let item = {
             Stask_ID:id,
             Stask:input_Popup.val(),
             Status:1  
         }      
     if(txt !== ""){          
         if(listStask.length <= 0){
             item.Stask_ID = 1;
             listStask.push(item);
             localStorage.setItem("listStask",JSON.stringify(listStask));
         }
         else{
             item.Stask_ID = (listStask[listStask.length - 1].Stask_ID)+1;
             listStask.push(item);
             localStorage.setItem("listStask",JSON.stringify(listStask)); 
         } 
         render(listStask,boby);    
         countStaskByStatus(1,local_count_stask_active);   
         input_Popup.val("");
         $(".btn-action").removeClass("active"); 
         $(".btn-stask-all").addClass("active");  
         box_up_create.slideUp(); 
     } 
    
 });

 render(listStask,boby);
 // ========================================= xóa stask ==================================================\\
 $(document).on('click','.fa-trash-alt', function (){
     let idStask = $(this).data("delete_id");
     let IndexStask = listStask.findIndex(e =>{ return e.Stask_ID === idStask});
     $(".s_" + idStask).remove();
     listStask.splice(IndexStask,1); 
     localStorage.setItem("listStask",JSON.stringify(listStask));
     countStaskByStatus(0,local_count_stask_complete);
 })

 //============================================ hàm sửa stask =============================================\\
 $(document).on('click','.fa-edit', function (){
     let idStask = $(this).data("edit_id");
     let StaskEdit = listStask.find(e =>{ return e.Stask_ID === idStask});
     input_Popup.val(StaskEdit.Stask);
     objByEdit = StaskEdit;
     $(".btn-add-todo").hide();
     $(".btn-edit").show();
     box_up_create.slideDown();   
 })
     // =============================== lưu statsk sau khi thay đổi =========================================\\
    $(document).on('click','.btn-edit', function (){
            let staskValueEdit = input_Popup.val();
            if(staskValueEdit !== "") {
                objByEdit.Stask = staskValueEdit;
                localStorage.setItem("listStask",JSON.stringify(listStask));
                render(listStask,boby);
                $(".box_up_Create").slideUp();
                $(".btn-add-todo").show();
                $(".btn-edit").hide();
            }
        })
     
 // ===================================== Hàm đếm số lượng satsk ==========================================\\
 function countStaskByStatus(status,local_html_count_stask){
     var stk = listStask.filter( s =>{ return s.Status === status;});
     local_html_count_stask.text(stk.length);
 }
 //
 countStaskByStatus(1,local_count_stask_active);
 countStaskByStatus(0,local_count_stask_complete);

 // ===================================== Hàm lọc Stask theo Status =========================================\\
 function staskFilterBySttus(status){
     var stk = listStask.filter( s =>{ return s.Status == status;});
     return stk;
 }
 // ===================================== Hàm thay đổi status Stask ========================================\\
 $(document).on('click','.btn-complete_stack i', function (){
             let id = $(this).data("staskid");
             let staskFindById = listStask.find( e =>{ return e.Stask_ID === id;});
             let status = staskFindById.Status;
             if(staskFindById.Status === 0){ 
                 staskFindById.Status = 1;
                 localStorage.setItem("listStask",JSON.stringify(listStask)); 
             }
             else{
                 staskFindById.Status = 0;
                 localStorage.setItem("listStask",JSON.stringify(listStask));
             }
             countStaskByStatus(1,local_count_stask_active);
             countStaskByStatus(0,local_count_stask_complete);      
             if(check_type_display === "t"){    
                 let list  = staskFilterBySttus(status);        
                 render(list,boby);
             }
             else{
                 render(listStask,boby);
             }
         }) 
 // hàm hiển thị stasks trạng thái  active //
 $(".btn-stask-active").click(()=>{
     boby.attr("data-check","t");
     check_type_display = boby.attr("data-check");
     let ListStaskActive = staskFilterBySttus(1);
     render(ListStaskActive,boby);       
 })

 // hàm hiển thị các stasks trạng thái  all //
 $(".btn-stask-all").click(()=>{
     boby.attr("data-check","f");
     check_type_display = boby.attr("data-check");
     render(listStask,boby);    
 })

 // hàm hiện thị trạng thái stask complete //
 $(".btn-stask-complete").click(() => {  
     boby.attr("data-check","t"); 
     check_type_display = boby.attr("data-check");
     let ListStaskComplete = staskFilterBySttus(0);
     render(ListStaskComplete,boby);   
 })
