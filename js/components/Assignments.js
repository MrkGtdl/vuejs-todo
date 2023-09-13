import AssignmentList from "./AssignmentList.js";
import AssignmentCreate from "./AssignmentCreate.js";

export default {
    components:{AssignmentList,AssignmentCreate},
    template:`
    <section class="space-y-6 mt-1">
        <div class="row">
        
            <div class="column float-left w-1/2  h-80 text-black border-r border-gray-400 " style="background-color:white;">
            <h1 class="font-bold p-2.5 bg-amber-400 text-white">In Progress</h1>
                <assignment-list :assignments="filters.inProgress"></assignment-list>
            </div>

            <div class="column float-left w-1/2 h-80 text-black" style="background-color:white;">
            <h1 class="font-bold p-2.5  bg-amber-400 text-white">Completed</h1>
                <assignment-list :assignments="filters.completed"></assignment-list>
            </div>
        </div>
    </section>
    <div class="py-10">
    <assignment-create @add="add"></assignment-create>
    </div>
    `,
    data() {
        return{
            assignments:[
                {name: 'Finish project', complete: false, id: 1, tag:'math' },
                {name: 'Read chapter 4', complete: false, id: 2, tag:'science'},
                {name: 'Turn in homework', complete: false, id: 3, tag: 'english' },
            ],

        }
    },

    computed:{
        filters() {
            return {
                inProgress: this.assignments.filter(assignment => !assignment.complete),
                completed: this.assignments.filter(assignment => assignment.complete)
            }
        }
    },

    methods: {
        add(name) { 
            this.assignments.push({
                name: name,
                completed:false,
                id:this.assignments.length + 1
            });
        }
    }
}