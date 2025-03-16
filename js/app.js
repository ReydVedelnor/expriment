let create = document.querySelector("#create");
let modal = document.querySelector("#create-student");
let update_modal = document.querySelector("#update-student");
let clos = document.querySelector("#close");
let update_clos = document.querySelector("#update-close");
let edit = document.querySelector("#edit");
let save=document.querySelector("#save");
let update=document.querySelector('#update');

create.addEventListener("click", () => {
    modal.style.display = "flex";
});

clos.addEventListener("click", () => {
    modal.style.display = "none";
});

update_clos.addEventListener("click", () => {
    update_modal.style.display = "none";
});

/*edit.addEventListener("click", () => {
    update_modal.style.display = "flex";
});*/

//create Student

save.addEventListener("click", async()=>{
    try{
        let name = document.querySelector("#name").value;
        let age = document.querySelector("#age").value;
        let country = document.querySelector("#country").value;

        const res=await fetch("php/insert-data.php", {
            method: "POST",
            body: JSON.stringify({"name": name, "age": age, "country": country}),
            headers:{
                "Content-Type": "application/json"
            }
        });

        const output=await res.json();

        if(output.success){
            alert(output.message);
            name="";
            age="";
            country="";
            modal.style.display="none";
            getStudents();
        }else{
            alert(output.message);
        }
    } catch(error){
        console.log("error "+ error.message);
    }
})

const getStudents=async()=>{
    try{
        const tbody=document.querySelector("#tbody");
        let tr="";
        const res = await fetch("php/select-data.php", {
            method: "GET",
            headers:{
                "Content-Type": "application/json"
            }
        });

        const output = await res.json();
        if(output.empty=== "empty"){
            tr="<tr>Record Not Found</tr>"
        }else{
            for(var i in output){
                tr+=`
                <tr>
                <td>${output[i].id}</td>
                <td>${output[i].std_name}</td>
                <td>${output[i].std_age}</td>
                <td>${output[i].std_country}</td>
                <td><button onclick="editStudent(${output[i].id})" class="btn btn-success" id="edit">Edit</button></td>
                <td><button onclick="deleteStudent(${output[i].id})" class="btn btn-danger">Delete</button></td>
                `
            }
        }
        tbody.innerHTML=tr;
    }catch(error){
        console.log("error " + error.message);
    }
}

getStudents();

//edit Student

const editStudent = async(id)=>{
    update_modal.style.display="flex";

    const res = await fetch(`php/edit-data.php?id=${id}`, {
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })
    const output=await res.json();
    console.log(output);

    if(output["empty"]!=="empty"){
        for(var i in output){
            document.querySelector("#edit_name").value=output[i].std_name;
            document.querySelector("#id").value=output[i].id;
            document.querySelector("#edit_age").value=output[i].std_age;
            document.querySelector("#edit_country").value=output[i].std_country;
        }
    }
};

//update Student
update.addEventListener("click", async()=>{
    let name = document.querySelector("#edit_name").value;
    let id = document.querySelector("#id").value;
    let age = document.querySelector("#edit_age").value;
    let country = document.querySelector("#edit_country").value;

    const res= await fetch("php/update-data.php",{
        method: "POST",
        body: JSON.stringify({
            "id": id,
            "name": name,
            "age": age,
            "country": country
        })
    });

    const output=await res.json();
    if(output.success){
        alert(output.message);
        name="";
        age="";
        country="";
        update_modal.style.display="none";
        getStudents();
    }else{
        alert(output.message);
    }
});

//delete Student

const deleteStudent=async(id)=>{
    const res=await fetch("php/delete-data.php?id="+ id,{
        method:"GET",
    });
    const output=await res.json();
    if(output.success){
        alert(output.message);
        update_modal.style.display="none";
        getStudents();
    }else{
        alert(output.message);
    }
}