



export function renderCalaries() {
    
    console.log('rendered')

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = '';
    


    // const cal_section = document.createElement('div')
    // cal_section.id = 'cal_section'

    axios
    .get("/api/session")
    .then((response) => {
        console.log(response.data)
        const user_id = response.data.user_id

            //add new calories function
            const formSection = document.createElement('section')
            formSection.setAttribute("id","form_section")
            
            const form = document.createElement('form')
            form.setAttribute("id","cal_form")
            form.innerHTML = `
                <input type="hidden" name="user_id" value=${user_id}>
                <p>Add Calories Burned</p>
                <input type="date" name="date">
                <br>
                <input type="number" name="calories" value='Calories Consumed'>
                <br>
                <button>Submit</button>`
            form.setAttribute("method","POST")
            formSection.appendChild(form)

            // add box section to display left calorie
            let date = new Date()
            let year = date.getFullYear(date)
            let month = date.getMonth(date) + 1
            let day = date.getDay(date)
            let currentDate = year +'-'+month+'-'+day
            let parse_date = Date.parse(currentDate)
            console.log(typeof(currentDate))
            console.log(parse_date)

            axios
            .get(`/profile/left_calaries/${user_id}/'2023-01-01'`)
            .then((response) => {
                console.log(response.data)
                const list = response.data
                console.log(list[0])
                const consumed = list[0].sum
                const goal = list[0].calorie_goal
            

                const left_cal = document.createElement('div')
                left_cal.setAttribute('id', 'left-cal')
                if (goal <= consumed) {
                    left_cal.innerHTML =`
                            <p>Today is ${currentDate} </p>
                            <p>You have achieved your goal</p>  
                        `
                } else {
                    left_cal.innerHTML =`
                    <p>Today is ${currentDate} </p>
                    <p>You still get ${goal-consumed} calories to burn</p>  
                    `
                }
                formSection.appendChild(left_cal)
            })



            form.addEventListener("submit", function (event) {
                event.preventDefault();

                const formData = new FormData(form);
                const data = {
                    user_id: formData.get('user_id'),
                    date: formData.get("date"),
                    calories: formData.get('calories')
                }

                console.log(data)

                axios
                    .post('/profile/calaries', data)
                    .then((response) => {
                        console.log(response)
                        renderCalaries()
                    })
            // end of new calories posting
            })

        axios
            .get(`/profile/calaries/${user_id}`)
            .then((response) => {
                const list = response.data
                console.log(list)
                console.log('hello')

                const cal_section = document.createElement('div')
                cal_section.id = 'cal-section'

               

                list.forEach(item=> {
                console.log(item)
                const user_id = item.user_id
               
                console.log(user_id)
                const date = new Date(item.date)
                console.log(date)
                let year = date.getFullYear(date)
                let month = date.getMonth(date)
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let displayMonth = monthNames[month]
                console.log(month)
                let day = date.getDay(date)
                let d = date.getDate()
                const calories = item.calories
                // const cal_section = document.createElement('div')

                cal_section.innerHTML += `
                
                <div class="cal-card-container">
                <div id="cal_rendering">
                   
                    <h2>Acitivty Date: ${day + 1} - ${displayMonth} - ${year}</h2>
                    <h2>Calaries Consumed: ${calories} Calaries</h2>
                </div>
                </div>
                

                
               
                `})

                mainContainer.appendChild(formSection) 
                mainContainer.appendChild(cal_section)
                 
            
            })   
            })}
