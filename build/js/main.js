(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var DataStorage = /** @class */ (function () {
    function DataStorage(dataname) {
        //check if local storage available
        if (window.localStorage) {
            //local storage  available
            this.status = true;
            this.dataname = dataname;
        }
        else {
            //local storage not available
            this.status = false;
        }
    }
    DataStorage.prototype.read = function (callback) {
        if (this.status) {
            try {
                var data = window.localStorage.getItem(this.dataname);
                callback(JSON.parse(data));
            }
            catch (error) {
                //console.log(error)
                callback(false);
            }
        }
    };
    DataStorage.prototype.store = function (tasks, callback) {
        if (this.status) {
            try {
                var data = JSON.stringify(tasks);
                window.localStorage.setItem(this.dataname, data);
                callback(true);
            }
            catch (error) {
                //console.log(error)
                callback(false);
            }
        }
    };
    return DataStorage;
}());
exports.DataStorage = DataStorage;
},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ListView = /** @class */ (function () {
    function ListView(listid) {
        this.list = document.getElementById(listid);
    }
    ListView.prototype.render = function (items) {
        var _this = this;
        items.forEach(function (task) {
            var id = task.id;
            var name = task.name;
            var status = task.status;
            var color = task.color;
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\", data-color=\"" + color + "\">\n                            \n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n                                <button type=\"button\" data-function=\"changecolor\"><img src=\"images/a.png\"</button>\n            </div>\n            </div>\n            <li>";
            var fragment = document.createRange().createContextualFragment(template);
            _this.list.appendChild(fragment);
        });
    };
    ListView.prototype.clear = function () {
        this.list.innerHTML = '';
    };
    return ListView;
}());
exports.ListView = ListView;
},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var listview_1 = require("../ts/listview");
var task_1 = require("../ts/task");
//import { Template } from '../ts/template';
var taskmanager_1 = require("../ts/taskmanager");
var datastorage_1 = require("../ts/datastorage");
function getParentId(elm) {
    while (elm.parentNode) {
        elm = elm.parentNode;
        var id = elm.getAttribute('id');
        if (id) {
            return id;
        }
    }
    return null;
}
//----INITIALISE CLASSES
//array to store tasks
var taskarray = [];
//storage class
var taskstorage = new datastorage_1.DataStorage('taskdata');
//Task Manager class, pass the task array
var taskmanager = new taskmanager_1.TaskManager(taskarray);
//list view
var listview = new listview_1.ListView('task-list');
//task template
//export var tasktemplate = new Template();
//things to do when app loads
window.addEventListener('load', init);
function init() {
    //read tasks from storage and display
    taskstorage.read(function (data) {
        if (data.length > 0) {
            data.forEach(function (item) {
                taskarray.push(item);
            });
            listview.clear();
            listview.render(taskarray);
        }
    });
}
//reference to form
var taskform = document.getElementById('task-form');
//add listener to form
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    //prevent blank tasks form being created
    if (taskname.length > 0) {
        var task = new task_1.Task(taskname);
        taskmanager.add(task);
        taskstorage.store(taskarray, function (result) {
            if (result) {
                taskform.reset();
                listview.clear();
                listview.render(taskarray);
            }
            else {
                //show error message / call error handler
            }
        });
    }
});
//--LIST STUFF
//add listener to list
var listelement = document.getElementById('task-list');
//add listener to list
listelement.addEventListener('click', function (event) {
    var target = event.target;
    var id = getParentId(event.target);
    if (target.getAttribute('data-function') == 'status') {
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
    if (target.getAttribute('data-function') == 'delete') {
        if (id) {
            taskmanager.remove(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
    if (target.getAttribute('data-function') == 'changecolor') {
        if (id) {
            taskmanager.changeColor(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
});
},{"../ts/datastorage":1,"../ts/listview":2,"../ts/task":4,"../ts/taskmanager":5}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime().toString(); //create new date object
        this.name = taskname;
        this.status = false;
        this.color = false;
    }
    return Task;
}());
exports.Task = Task;
},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TaskManager = /** @class */ (function () {
    function TaskManager(arrayname) {
        this.tasks = arrayname;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
    };
    TaskManager.prototype.remove = function (id, callback) {
        var index_to_remove = undefined;
        this.tasks.forEach(function (item, index) {
            if (item.id == id) {
                index_to_remove = index;
            }
        });
        if (index_to_remove !== undefined) {
            this.tasks.splice(index_to_remove, 1);
        }
        callback();
    };
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id === id) {
                if (task.status == false) {
                    task.status = true;
                    return;
                }
                else {
                    task.status = false;
                }
            }
        });
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            var id1 = parseInt(task1.id);
            var id2 = parseInt(task2.id);
            if (task1.status == true && task2.status == false) {
                return 1;
            }
            if (task1.status == false && task2.status == true) {
                return -1;
            }
            if (task1.status == task2.status) {
                return 0;
            }
        });
    };
    TaskManager.prototype.changeColor = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id === id) {
                if (task.color == false) {
                    task.color = true;
                    return;
                }
                else {
                    task.color = false;
                }
            }
        });
        this.sort(this.tasks);
        callback();
    };
    return TaskManager;
}());
exports.TaskManager = TaskManager;
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBSUUscUJBQWEsUUFBZTtRQUMxQixrQ0FBa0M7UUFDbEMsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO1lBQ3pCLDBCQUEwQjtZQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUMxQjthQUNHO1lBQ0osNkJBQTZCO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1osSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBRztnQkFDRCxJQUFJLElBQUksR0FBVSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdELFFBQVEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBRSxDQUFFLENBQUM7YUFDaEM7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDWixvQkFBb0I7Z0JBQ3BCLFFBQVEsQ0FBRSxLQUFLLENBQUMsQ0FBQzthQUNsQjtTQUNGO0lBQ0gsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBRztnQkFDRCxJQUFJLElBQUksR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFFLEtBQUssQ0FBRSxDQUFDO2dCQUMxQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBRSxDQUFDO2dCQUNsRCxRQUFRLENBQUUsSUFBSSxDQUFFLENBQUM7YUFDbEI7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDWixvQkFBb0I7Z0JBQ3BCLFFBQVEsQ0FBRSxLQUFLLENBQUUsQ0FBQzthQUNuQjtTQUNGO0lBQ0gsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0F6Q0EsQUF5Q0MsSUFBQTtBQXpDWSxrQ0FBVzs7OztBQ0F4QjtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFBekIsaUJBb0JDO1FBbkJHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN2QixJQUFJLFFBQVEsR0FBRyxjQUFXLEVBQUUseUJBQWtCLE1BQU0seUJBQWtCLEtBQUssZ0tBRzlCLElBQUksZ2NBTzVDLENBQUM7WUFDTixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUUsUUFBUSxDQUFFLENBQUM7WUFDM0UsS0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0Qsd0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFFLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0wsZUFBQztBQUFELENBN0JBLEFBNkJDLElBQUE7QUE3QlksNEJBQVE7Ozs7QUNBckIsMkNBQTBDO0FBQzFDLG1DQUFrQztBQUNsQyw0Q0FBNEM7QUFDNUMsaURBQWdEO0FBQ2hELGlEQUFnRDtBQUVoRCxxQkFBcUIsR0FBUTtJQUMzQixPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUU7UUFDckIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDckIsSUFBSSxFQUFFLEdBQXlCLEdBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxFQUFFLEVBQUU7WUFDTixPQUFPLEVBQUUsQ0FBQztTQUNYO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFDRCx3QkFBd0I7QUFDeEIsc0JBQXNCO0FBQ3RCLElBQUksU0FBUyxHQUFnQixFQUFFLENBQUM7QUFDaEMsZUFBZTtBQUNmLElBQUksV0FBVyxHQUFHLElBQUkseUJBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5Qyx5Q0FBeUM7QUFDekMsSUFBSSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxDQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQy9DLFdBQVc7QUFDWCxJQUFJLFFBQVEsR0FBRyxJQUFJLG1CQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekMsZUFBZTtBQUNmLDJDQUEyQztBQUczQyw2QkFBNkI7QUFDN0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsQ0FBQztBQUNyQztJQUNFLHFDQUFxQztJQUNyQyxXQUFXLENBQUMsSUFBSSxDQUFFLFVBQUMsSUFBSTtRQUNyQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxPQUFPLENBQUUsVUFBQyxJQUFJO2dCQUNqQixTQUFTLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLFFBQVEsQ0FBQyxNQUFNLENBQUUsU0FBUyxDQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxtQkFBbUI7QUFDbkIsSUFBTSxRQUFRLEdBQXFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFFLENBQUM7QUFDekYsc0JBQXNCO0FBQ3RCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBRSxLQUFZO0lBQ2hELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN2QixJQUFJLEtBQUssR0FBZSxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlELElBQUksUUFBUSxHQUE4QixLQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3ZELHdDQUF3QztJQUN4QyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLElBQUksSUFBSSxHQUFRLElBQUksV0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLFdBQVcsQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsV0FBVyxDQUFDLEtBQUssQ0FBRSxTQUFTLEVBQUUsVUFBRSxNQUFNO1lBQ3BDLElBQUksTUFBTSxFQUFFO2dCQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDakIsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQixRQUFRLENBQUMsTUFBTSxDQUFFLFNBQVMsQ0FBRSxDQUFDO2FBQzlCO2lCQUNHO2dCQUNGLHlDQUF5QzthQUMxQztRQUNILENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQWM7QUFDZCxzQkFBc0I7QUFDdEIsSUFBTSxXQUFXLEdBQWUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyRSxzQkFBc0I7QUFDdEIsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQVc7SUFDaEQsSUFBSSxNQUFNLEdBQTZCLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDcEQsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFVLEtBQUssQ0FBQyxNQUFPLENBQUUsQ0FBQztJQUU5QyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksUUFBUSxFQUFFO1FBQ3BELElBQUksRUFBRSxFQUFFO1lBQ04sV0FBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUM7Z0JBQzFCLFdBQVcsQ0FBQyxLQUFLLENBQUUsU0FBUyxFQUFHO29CQUM3QixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2pCLFFBQVEsQ0FBQyxNQUFNLENBQUUsU0FBUyxDQUFFLENBQUM7Z0JBQy9CLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDSjtLQUNGO0lBQ0QsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLFFBQVEsRUFBQztRQUNuRCxJQUFJLEVBQUUsRUFBRTtZQUNOLFdBQVcsQ0FBQyxNQUFNLENBQUUsRUFBRSxFQUFFO2dCQUN0QixXQUFXLENBQUMsS0FBSyxDQUFFLFNBQVMsRUFBRTtvQkFDNUIsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNqQixRQUFRLENBQUMsTUFBTSxDQUFFLFNBQVMsQ0FBRSxDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7S0FDRjtJQUNELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxhQUFhLEVBQUU7UUFDekQsSUFBSSxFQUFFLEVBQUU7WUFDTixXQUFXLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBQztnQkFDekIsV0FBVyxDQUFDLEtBQUssQ0FBRSxTQUFTLEVBQUc7b0JBQzdCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDakIsUUFBUSxDQUFDLE1BQU0sQ0FBRSxTQUFTLENBQUUsQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO0tBQ0Y7QUFDSCxDQUFDLENBQUMsQ0FBQzs7OztBQzNHSDtJQU1FLGNBQVksUUFBZ0I7UUFDMUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsd0JBQXdCO1FBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBRXJCLENBQUM7SUFHSCxXQUFDO0FBQUQsQ0FmQSxBQWVDLElBQUE7QUFmWSxvQkFBSTs7OztBQ0VqQjtJQUVFLHFCQUFZLFNBQXNCO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0lBQ3pCLENBQUM7SUFDRCx5QkFBRyxHQUFILFVBQUksSUFBUztRQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO0lBQzFCLENBQUM7SUFDRCw0QkFBTSxHQUFOLFVBQU8sRUFBUyxFQUFFLFFBQVE7UUFDeEIsSUFBSSxlQUFlLEdBQVUsU0FBUyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLFVBQUMsSUFBUyxFQUFFLEtBQVk7WUFDMUMsSUFBRyxJQUFJLENBQUMsRUFBRSxJQUFLLEVBQUUsRUFBQztnQkFDaEIsZUFBZSxHQUFHLEtBQUssQ0FBQzthQUN6QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxlQUFlLEtBQUssU0FBUyxFQUFDO1lBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLGVBQWUsRUFBRSxDQUFDLENBQUUsQ0FBQztTQUN6QztRQUNELFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUNELGtDQUFZLEdBQVosVUFBYSxFQUFTLEVBQUMsUUFBUTtRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxVQUFDLElBQVM7WUFDNUIsSUFBRyxJQUFJLENBQUMsRUFBRSxLQUFNLEVBQUUsRUFBQztnQkFDakIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtvQkFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ25CLE9BQU87aUJBQ1I7cUJBQ0c7b0JBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7aUJBQ3JCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBQ3hCLFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUlELDBCQUFJLEdBQUosVUFBTSxLQUFpQjtRQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFDLEtBQUs7WUFDckIsSUFBSSxHQUFHLEdBQVUsUUFBUSxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUUsQ0FBQztZQUN0QyxJQUFJLEdBQUcsR0FBVSxRQUFRLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBRSxDQUFDO1lBQ3RDLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUU7Z0JBQ2pELE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO2dCQUNqRCxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1g7WUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDakMsT0FBTyxDQUFDLENBQUM7YUFDVjtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGlDQUFXLEdBQVgsVUFBWSxFQUFTLEVBQUMsUUFBUTtRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxVQUFDLElBQVM7WUFDMUIsSUFBRyxJQUFJLENBQUMsRUFBRSxLQUFNLEVBQUUsRUFBQztnQkFDakIsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE9BQU87aUJBQ1I7cUJBQ0c7b0JBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7aUJBQ3BCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBRXhCLFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUlILGtCQUFDO0FBQUQsQ0ExRUEsQUEwRUMsSUFBQTtBQTFFWSxrQ0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRhU3RvcmFnZXtcclxuICBzdGF0dXM6Ym9vbGVhbjtcclxuICBjaGFuZ2Vjb2xvcjpib29sZWFuO1xyXG4gIGRhdGFuYW1lOnN0cmluZztcclxuICBjb25zdHJ1Y3RvciggZGF0YW5hbWU6c3RyaW5nICl7XHJcbiAgICAvL2NoZWNrIGlmIGxvY2FsIHN0b3JhZ2UgYXZhaWxhYmxlXHJcbiAgICBpZiggd2luZG93LmxvY2FsU3RvcmFnZSApe1xyXG4gICAgLy9sb2NhbCBzdG9yYWdlICBhdmFpbGFibGVcclxuICAgICAgdGhpcy5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICB0aGlzLmRhdGFuYW1lID0gZGF0YW5hbWU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgLy9sb2NhbCBzdG9yYWdlIG5vdCBhdmFpbGFibGVcclxuICAgICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVhZCggY2FsbGJhY2sgKXtcclxuICAgIGlmKCB0aGlzLnN0YXR1cyApe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgbGV0IGRhdGE6c3RyaW5nID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZGF0YW5hbWUpO1xyXG4gICAgICAgIGNhbGxiYWNrKCBKU09OLnBhcnNlKCBkYXRhICkgKTtcclxuICAgICAgfVxyXG4gICAgICBjYXRjaCggZXJyb3IgKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgIGNhbGxiYWNrIChmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgc3RvcmUoIHRhc2tzOkFycmF5IDxUYXNrPiwgY2FsbGJhY2sgKXtcclxuICAgIGlmKCB0aGlzLnN0YXR1cyApe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgbGV0IGRhdGE6c3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoIHRhc2tzICk7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZGF0YW5hbWUsIGRhdGEgKTtcclxuICAgICAgICBjYWxsYmFjayggdHJ1ZSApO1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGNoKCBlcnJvciApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgY2FsbGJhY2soIGZhbHNlICk7IFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcclxuICAgIGxpc3Q6SFRNTEVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3RvciggbGlzdGlkOnN0cmluZyApe1xyXG4gICAgICAgIHRoaXMubGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsaXN0aWQgKTtcclxuICAgIH1cclxuICAgIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKCh0YXNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRhc2suaWQ7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGFzay5uYW1lO1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXM7XHJcbiAgICAgICAgICAgIGxldCBjb2xvciA9IHRhc2suY29sb3I7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCIsIGRhdGEtY29sb3I9XCIke2NvbG9yfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJkZWxldGVcIj4mdGltZXM7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImNoYW5nZWNvbG9yXCI+PGltZyBzcmM9XCJpbWFnZXMvYS5wbmdcIjwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxsaT5gO1xyXG4gICAgICAgICAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCggdGVtcGxhdGUgKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5saXN0LmlubmVySFRNTCA9Jyc7XHJcbiAgICB9XHJcbn0iLCIvLyBpbXBvcnQgbW9kdWxlcyBmcm9tIG90aGVyIGZpbGVzXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSAnLi4vdHMvbGlzdHZpZXcnO1xuaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xuLy9pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJy4uL3RzL3RlbXBsYXRlJztcbmltcG9ydCB7IFRhc2tNYW5hZ2VyIH0gZnJvbSAnLi4vdHMvdGFza21hbmFnZXInO1xuaW1wb3J0IHsgRGF0YVN0b3JhZ2UgfSBmcm9tICcuLi90cy9kYXRhc3RvcmFnZSc7XG5cbmZ1bmN0aW9uIGdldFBhcmVudElkKGVsbTpOb2RlKXtcbiAgd2hpbGUoIGVsbS5wYXJlbnROb2RlICl7XG4gICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XG4gICAgbGV0IGlkOnN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+IGVsbSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIGlmKCBpZCApe1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbi8vLS0tLUlOSVRJQUxJU0UgQ0xBU1NFU1xuLy9hcnJheSB0byBzdG9yZSB0YXNrc1xudmFyIHRhc2thcnJheTogQXJyYXk8VGFzaz4gPSBbXTtcbi8vc3RvcmFnZSBjbGFzc1xudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCd0YXNrZGF0YScpO1xuLy9UYXNrIE1hbmFnZXIgY2xhc3MsIHBhc3MgdGhlIHRhc2sgYXJyYXlcbnZhciB0YXNrbWFuYWdlciA9IG5ldyBUYXNrTWFuYWdlciggdGFza2FycmF5ICk7XG4vL2xpc3Qgdmlld1xudmFyIGxpc3R2aWV3ID0gbmV3IExpc3RWaWV3KCd0YXNrLWxpc3QnKTtcbi8vdGFzayB0ZW1wbGF0ZVxuLy9leHBvcnQgdmFyIHRhc2t0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZSgpO1xuXG5cbi8vdGhpbmdzIHRvIGRvIHdoZW4gYXBwIGxvYWRzXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsaW5pdCk7XG5mdW5jdGlvbiBpbml0KCl7XG4gIC8vcmVhZCB0YXNrcyBmcm9tIHN0b3JhZ2UgYW5kIGRpc3BsYXlcbiAgdGFza3N0b3JhZ2UucmVhZCggKGRhdGEpID0+IHtcbiAgICBpZiggZGF0YS5sZW5ndGggPiAwICl7XG4gICAgICBkYXRhLmZvckVhY2goIChpdGVtKSA9PiB7XG4gICAgICAgIHRhc2thcnJheS5wdXNoKCBpdGVtICk7XG4gICAgICB9KTtcbiAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xuICAgIH1cbiAgfSk7XG59XG4vL3JlZmVyZW5jZSB0byBmb3JtXG5jb25zdCB0YXNrZm9ybTpIVE1MRm9ybUVsZW1lbnQgPSAoPEhUTUxGb3JtRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1mb3JtJykpO1xuLy9hZGQgbGlzdGVuZXIgdG8gZm9ybVxudGFza2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKCBldmVudDogRXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgbGV0IGlucHV0OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcbiAgbGV0IHRhc2tuYW1lOiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnZhbHVlO1xuICAvL3ByZXZlbnQgYmxhbmsgdGFza3MgZm9ybSBiZWluZyBjcmVhdGVkXG4gIGlmKCB0YXNrbmFtZS5sZW5ndGggPiAwICl7XG4gICAgbGV0IHRhc2s6VGFzayA9IG5ldyBUYXNrKHRhc2tuYW1lKTtcbiAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2spO1xuICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICggcmVzdWx0ICkgPT4ge1xuICAgICAgaWYoIHJlc3VsdCApe1xuICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xuICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgLy9zaG93IGVycm9yIG1lc3NhZ2UgLyBjYWxsIGVycm9yIGhhbmRsZXJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbi8vLS1MSVNUIFNUVUZGXG4vL2FkZCBsaXN0ZW5lciB0byBsaXN0XG5jb25zdCBsaXN0ZWxlbWVudDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWxpc3QnKTtcbi8vYWRkIGxpc3RlbmVyIHRvIGxpc3Rcbmxpc3RlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OkV2ZW50KSA9PiB7XG4gIGxldCB0YXJnZXQ6SFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGV2ZW50LnRhcmdldDtcbiAgbGV0IGlkID0gZ2V0UGFyZW50SWQoICg8Tm9kZT4gZXZlbnQudGFyZ2V0KSApO1xuXG4gIGlmKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ3N0YXR1cycgKXtcbiAgICBpZiggaWQgKXtcbiAgICAgIHRhc2ttYW5hZ2VyLmNoYW5nZVN0YXR1cyhpZCwoKSA9PiB7XG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXkgLCAoKSA9PiB7XG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdkZWxldGUnKXtcbiAgICBpZiggaWQgKXtcbiAgICAgIHRhc2ttYW5hZ2VyLnJlbW92ZSggaWQsICgpID0+IHtcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUoIHRhc2thcnJheSwgKCkgPT4ge1xuICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnY2hhbmdlY29sb3InICl7XG4gICAgaWYoIGlkICl7XG4gICAgICB0YXNrbWFuYWdlci5jaGFuZ2VDb2xvcihpZCwoKSA9PiB7XG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXkgLCAoKSA9PiB7XG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJleHBvcnQgY2xhc3MgVGFza3tcclxuICBpZDogc3RyaW5nO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBzdGF0dXM6IGJvb2xlYW47XHJcbiAgY29sb3I6IGJvb2xlYW47XHJcbiAgXHJcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XHJcbiAgICB0aGlzLmlkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTsgLy9jcmVhdGUgbmV3IGRhdGUgb2JqZWN0XHJcbiAgICB0aGlzLm5hbWUgPSB0YXNrbmFtZTtcclxuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XHJcbiAgICB0aGlzLmNvbG9yID0gZmFsc2U7XHJcbiAgICBcclxuICB9ICBcclxuICBcclxuICBcclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXJ7XHJcbiAgdGFza3M6IEFycmF5PFRhc2s+OyBcclxuICBjb25zdHJ1Y3RvcihhcnJheW5hbWU6IEFycmF5PFRhc2s+KXtcclxuICAgIHRoaXMudGFza3MgPSBhcnJheW5hbWU7XHJcbiAgfVxyXG4gIGFkZCh0YXNrOlRhc2spe1xyXG4gICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgfVxyXG4gIHJlbW92ZShpZDpzdHJpbmcsIGNhbGxiYWNrICl7XHJcbiAgICBsZXQgaW5kZXhfdG9fcmVtb3ZlOm51bWJlciA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCggKGl0ZW06VGFzaywgaW5kZXg6bnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmKGl0ZW0uaWQgID09IGlkKXtcclxuICAgICAgICBpbmRleF90b19yZW1vdmUgPSBpbmRleDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiggaW5kZXhfdG9fcmVtb3ZlICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0aGlzLnRhc2tzLnNwbGljZSggaW5kZXhfdG9fcmVtb3ZlLCAxICk7XHJcbiAgICB9XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoaWQ6c3RyaW5nLGNhbGxiYWNrKTp2b2lke1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCAodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgIGlmKHRhc2suaWQgID09PSBpZCl7XHJcbiAgICAgICAgaWYoIHRhc2suc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgICB0YXNrLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICB0YXNrLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNvcnQoIHRoaXMudGFza3MgKTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIFxyXG4gIFxyXG4gIFxyXG4gIHNvcnQoIHRhc2tzOkFycmF5PFRhc2s+ICl7XHJcbiAgICB0YXNrcy5zb3J0KCh0YXNrMSx0YXNrMikgPT4ge1xyXG4gICAgICBsZXQgaWQxOm51bWJlciA9IHBhcnNlSW50KCB0YXNrMS5pZCApO1xyXG4gICAgICBsZXQgaWQyOm51bWJlciA9IHBhcnNlSW50KCB0YXNrMi5pZCApO1xyXG4gICAgICBpZiggdGFzazEuc3RhdHVzID09IHRydWUgJiYgdGFzazIuc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSBmYWxzZSAmJiB0YXNrMi5zdGF0dXMgPT0gdHJ1ZSApe1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiggdGFzazEuc3RhdHVzICA9PSB0YXNrMi5zdGF0dXMgKXtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgY2hhbmdlQ29sb3IoaWQ6c3RyaW5nLGNhbGxiYWNrKTp2b2lke1xyXG4gIHRoaXMudGFza3MuZm9yRWFjaCggKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICBpZih0YXNrLmlkICA9PT0gaWQpe1xyXG4gICAgICAgIGlmKCB0YXNrLmNvbG9yID09IGZhbHNlICl7XHJcbiAgICAgICAgICB0YXNrLmNvbG9yID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHRhc2suY29sb3IgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgIFxyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgXHJcblxyXG5cclxufVxyXG4iXX0=
