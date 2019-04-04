// GLOBAL CONSTANTS
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdays_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// PROTOTYPES
Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// DATEPICKER
class Datepicker {
    constructor(host, s) {
        const t = this;
        t.host = host;
        t.frame = document.createElement("div");
        t.frame.id = "datepicker-frame";
        t.frame.className = "noselect";
        
        t.table = document.createElement("table");
        t.frame.append(t.table);
        
        // Run config if settings present
        if (s) t.config(s); 
        
        // Show conditions
        window.onresize = () => { if (t.display_state) show(true); }; // to update screen position
        document.addEventListener("click", e => {
            if (
                e.target == t.host &&
                !t.frame //document.getElementById("datepicker-frame")
            ) {
                t.load("day"); // Start date when opening
                show(true);
            }
            else{
				var oP = t.frame;
				//document.getElementById("datepicker-frame");
    			if (oP && 
                //oP != null && e.path && !e.path.includes(document.getElementById("datepicker-frame"))
				(e.clientX < oP.offsetLeft || e.clientX > oP.offsetLeft + oP.offsetWidth || 
				 e.clientY < oP.offsetTop || e.clientY > oP.offsetTop + oP.offsetHeight)
                 ) show(false);
		    }
        });
        
        // Load
        t.load = function (n) {
            while (t.table.firstChild) t.table.removeChild(t.table.firstChild);
            t.table.className = n;
            // If data is month
            if (n == "day") {
                // Row 1 [Prev, Month and year, Next]
                const row1 = document.createElement("tr");
                t.table.append(row1);
                
                // Prev
                const prev = document.createElement("th");
                row1.append(prev);
                prev.innerHTML = "<<";
                if (t.firstdate == undefined || (
                    t.date.getMonth() > t.firstdate.getMonth() ||
                    t.date.getFullYear() > t.firstdate.getFullYear())
                ) {
                    prev.className = "pointer";
                    prev.onclick = () => {
                        t.date = new Date(t.date.getFullYear(), t.date.getMonth() - 1, 1);
                        t.load("day");
                    };
                } else prev.className = "disabled";
    
                // month and year
                const head = document.createElement("th");
                row1.append(head);
                head.colSpan = 5;
                head.innerHTML = months[t.date.getMonth()] + " " + t.date.getFullYear();
                head.onclick = () => {
                    t.load("month");
                };
                head.className = "pointer";
    
                // Next
                const next = document.createElement("th");
                row1.append(next);
                next.innerHTML = ">>";
                if (t.lastdate == undefined || (
                    t.date.getMonth() < t.lastdate.getMonth() ||
                    t.date.getFullYear() < t.lastdate.getFullYear())
                ) {
                    next.className = "pointer";
                    next.onclick = () => {
                        t.date = new Date(t.date.getFullYear(), t.date.getMonth() + 1, 1);
                        t.load("day");
                    };
                } else next.className = "disabled";
    
                // Row 2 [Weekdays]
                const row2 = document.createElement("tr");
                t.table.append(row2);
                for (let day = 0; day < 7; day++) {
                    const cell = document.createElement("th");
                    cell.innerHTML = weekdays_short[day];
                    row2.append(cell);
                }
    
                // Dates
                const first_day_in_month = new Date(t.date.getFullYear(), t.date.getMonth(), 1);
                let index = 1 - (first_day_in_month.getDay() || 7);
                for (let y = 0; y < 6; y++) {
                    const tr = document.createElement("tr");
                    t.table.append(tr);
                    for (let x = 0; x < 7; x++) {
                        const day = new Date(first_day_in_month.getTime() + DAY * index);
                        
                        const td = document.createElement("td");
                        tr.append(td);
                        td.innerHTML = day.getDate();
                        
                        if (day.getMonth() == t.date.getMonth() && t.disableddays(day) && (
                            t.firstdate == undefined ? true : (
                                day.getMonth() == t.firstdate.getMonth() ? (
                                    day.getFullYear() == t.firstdate.getFullYear() ?
                                        day.getDate() >= t.firstdate.getDate() : true
                                ) : true
                            )
                        ) && (
                            t.lastdate == undefined ? true : (
                                day.getMonth() == t.lastdate.getMonth() ? (
                                    day.getFullYear() == t.lastdate.getFullYear() ?
                                        day.getDate() <= t.lastdate.getDate() : true
                                ) : true
                            )
                        )) {
                            td.className = "pointer";
                            td.onclick = () => {
                                t.setDate(day);
                                show(false);
                            };
                        } else td.className = "disabled";
                        td.className += day.toDateString() == new Date().toDateString() ? " today" : "";
    
                        index++;
                    }
                }
            }
            
            // If data is year
            else if (n == "month") {
                // Row 1 [Prev, Year, Next]
                const row = document.createElement("tr");
                t.table.append(row);
                
                // Prev
                const prev = document.createElement("th");
                row.append(prev);
                prev.innerHTML = "<<";
                if (t.firstdate == undefined || (
                    t.date.getFullYear() > t.firstdate.getFullYear())
                ) {
                    prev.className = "pointer";
                    prev.onclick = () => {
                        t.date = new Date(t.date.getFullYear() - 1, 1, 1);
                        t.load("month");
                    };
                } else prev.className = "disabled";
        
                // Year
                const head = document.createElement("th");
                row.append(head);
                head.colSpan = 2;
                head.innerHTML = t.date.getFullYear();
        
                // Next
                const next = document.createElement("th");
                row.append(next);
                next.innerHTML = ">>";
                if (t.lastdate == undefined || (
                    t.date.getFullYear() < t.lastdate.getFullYear())
                ) {
                    next.className = "pointer";
                    next.onclick = () => {
                        t.date = new Date(t.date.getFullYear() + 1, 1, 1);
                        t.load("month");
                    };
                } else next.className = "disabled";
                
                // Months
                for (let y = 0; y < 3; y++) {
                    const row = document.createElement("tr");
                    t.table.append(row);
                    for (let x = 0; x < 4; x++) {
                        const index = y * 4 + x;
                        const day = new Date(t.date.getFullYear(), index, 1);
                        
                        const cell = document.createElement("td");
                        row.append(cell);
                        cell.innerHTML = months_short[index];
                        
                        if (
                            (t.firstdate != undefined ? day.getTime() >= new Date(t.firstdate).setDate(1) : true) &&
                            (t.lastdate != undefined ? day.getTime() <= new Date(t.lastdate).setDate(1) : true)
                        ) {
                            cell.className = "pointer";
                            cell.onclick = () => {
                                t.date = new Date(t.date.getFullYear(), index, 1);
                                t.load("day");
                            };
                        } else cell.className = "disabled";
                    }
                }
            }
        };

        t.show = function () {
			show(true);
		}
        
        const show = function (bool) {
            if (bool) {
                const rect = t.host.getBoundingClientRect();
                const x = (rect.left + rect.right) / 2;
                const y = rect.bottom - rect.top + document.documentElement.scrollTop;
                t.frame.style.setProperty("top", y + 20 + "px");
                t.frame.style.setProperty("left", x - 152 + "px");
                t.load("day");
                document.body.append(t.frame);
            }
            else if (!bool) t.frame.remove();
        };
    }
    
    config(s) {
        this.firstdate = s.firstdate || this.firstdate;
        this.lastdate = s.lastdate || this.lastdate;
        this.disableddays = s.disableddays || this.disableddays || (() => { return true; });
        this.format = s.format || this.format || ((d) => { return d; });

        if (typeof this.firstdate != "object" && this.firstdate != undefined) console.error("firstdate is not of type Object");
        else if (typeof this.lastdate != "object" && this.lastdate != undefined) console.error("lastdate is not of type Object");
        else if (typeof this.disableddays != "function") console.error("disableddays is not of type function");
        else if (typeof this.format != "function") console.error("format is not of type function");

        const d = new Date();
        let date = d;
        while (!this.disableddays(date)) {
            date = this.firstdate && this.lastdate ? (
                d.getTime() >= this.firstdate.getTime() && d.getTime() <= this.lastdate.getTime() ? d : this.firstdate
            ) : this.firstdate ? (
                d.getTime() >= this.firstdate.getTime() ? d : this.firstdate
            ) : this.lastdate ? (
                d.getTime() <= this.lastdate.getTime() ? d : this.lastdate
            ) : d;
            d.setTime(d.getTime() + DAY);
        }
        this.date = this.date || date;
        this.host.value = this.format(this.date);
		//this.show(true);
    }
    
    getDate() {
        return this.date;
    }
    
    setDate(date) {
        if (date < this.firstdate || date > this.lastdate) return;
        if (!this.disableddays(date)) {
            date = new Date(date.getTime() + DAY);
            this.setDate(date);
            return;
        }
        this.date = date;
        this.host.value = this.format(date);
        if(typeof this.host.onchange == "function") this.host.onchange();
    }
}