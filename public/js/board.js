let listIdG, elems, instance, form;
	
	function clearVariable(){
		elems = instance = null;
		form = null;
	}

	function internetError(){
		M.toast({
			html: `<i class="material-icons" style="color:red;margin-right:5px;">
						cancel
                    </i>
					 Something happening wrong or No internet`, 
			displayLength: 10000
		});
	}

	function showCard(uid, listId, date, desc){
		let time = new Date();
		$(`div#${listId}`).append(`<div id="${uid}" class="z-depth-1" style="text-align:center;padding: 15px 0;margin-bottom:5px;border: none;border-radius: 5px">
			<p>${desc}</p>
			<span>${ (date != null) ? (("<b>Due Date </b><br>")+ time.toDateString(date)): ""}</span>
			<br>
			<button onclick="archiveCard('${uid}')" style="margin-top: 5px" class="waves-effect waves-light btn purple darken-3 center">
				Archive
				<i class="material-icons left">
					archive
				</i>
			</button>
			</div>`);
	}

	function cardLoader(listId){
		$.get(`/users/cards/${uid}/${listId}`).done((res)=>{
			res.data.forEach((i)=>{
				(!i.archive) ? showCard(i.uid, listId, i.dueDate, i.desc)  : null;
			});
		}).fail(internetError);
	}
	
	function showList(name, uid){
		//adding element to the page
		$("#loadList").append(`<div class="col s12 m6 l3 purple darken-3 white-text" style="margin: 5px;padding:5px;border: none;border-radius: 5px">
			<h4 class="card-title center-align">
				${name}
				<i class="material-icons right">
				
				</i>
			</h4>
			<div class="divider white-text"></div>
			
			<div class="card-content purple darken-4" id="${uid}" style="padding: 5px"></div>
			
			<button onclick="addNewCard('${uid}')" class="waves-effect waves-light btn-small purple darken-2 right" style="margin: 5px">
				Add Card
			</button>
			</div>`);
	}

	function listLoader() {
		$.get(`/users/board/lists/cards/${uid}`).done((res)=>{
            res.data.forEach((i)=>{
                //loading list
                showList(i.name, i.uid);
        
                //loading cards
                i.cards.forEach((j)=>{
                    (!j.archive) ? showCard(j.uid, i.uid, j.dueDate, j.desc)  : null;
                });
            });
		}).fail(internetError);
	}
	
	function addNewCard(listId){
		elems = document.getElementById('modal1');
		instance = M.Modal.init(elems);
		instance.open();
		listIdG = listId;
		//clearVariable();
	}

	function archiveCard(uid){
		$.get(`/users/card/archive/${uid}`).done((res)=>{
			$(`div#${uid}`).remove();
		}).fail(internetError);
	}

	$(document).ready(function(){
		//loading list
		listLoader();

		//new member addition
		$("#newMemberForm").submit((event)=>{
			$("#addMemberBtn").addClass("disabled");
			event.preventDefault();
			
			form = $(this);
			let email = form.find("input[name='email']").val();
			elems = document.getElementById('addMember');
			instance = M.Modal.init(elems);
			instance.close();
			clearVariable();
			
			$.post(`/teams/add/member/${ uid }`, { email }).done((resp)=>{
					if (resp.msg == "NOT OK")
						M.toast({
							html: `<i class="material-icons left" style="color:red">
									cancel
								</i>
								User Not Exist`, 
							displayLength: 10000
						});
					else
						M.toast({
							html: `<i class="material-icons left" style="color:green">
									check_circle
								</i>
								User Added Successfully`, 
							displayLength: 10000
						});  
			}).fail(internetError);
			form.find("input[name='email']").val(null);
			$("#addMemberBtn").removeClass("disabled");
		});
		
		//adding new card
		$("#newCardForm").submit((event)=>{
			event.preventDefault();
			
			instance.close();
			clearVariable();

			form = $(this);
			let desc = form.find("textarea[name='desc']").val();
			let time = form.find("input[name='date']").val();
			
			time = (time != "") ? (new Date(time)):null;
			//let img = $('#img')[0].files[0];
			
			$.post(`/users/new/card/${uid}/${listIdG}`, { desc, time }).done((resp)=>{
				form.find("textarea[name='desc']").val(null);
				form.find("input[name='date']").val(null);
				showCard(resp.data.uid, listIdG, time, desc);
			}).fail(internetError);
		});
		
		//creating new list
		$("#newListForm").submit((event)=>{
			//not noramlly submission of form
			event.preventDefault();
			
			let $form = $(this); name = $form.find("input[name='name']").val();
			
			$form.find("input[name='name']").val(null);
			
			$.post(`/users/new/list/${uid}`, { name }).done((res)=>{
				M.toast({ 
					html: '<i class="material-icons left" style="color:green">check_circle</i> New list created successfully', 
					displayLength: 5000 
				});
				showList(name, res.data.uid);	
			}).fail(internetError);
	  	});
	});