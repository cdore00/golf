#https://www.youtube.com/watch?v=I2wwyOTtIe4
# coding=utf-8
import pdb
#; pdb.set_trace()
import sys, os, io, re, cgi, csv, urllib.parse
import urllib.request
import shutil
import tkinter as tk
import tkinter.ttk as ttk
from tkinter.constants import *
from tkinter import *
from tkinter import simpledialog
from PIL import ImageTk, Image
from tkinter import filedialog
from tkinter import messagebox, TclError, ttk
from tkinter.messagebox import askyesno
from tkcalendar import Calendar
from idlelib.tooltip import Hovertip
from collections import defaultdict

from bson import ObjectId
import time 
import datetime
import webbrowser

import dropbox, base64

def milliToDate(milli, showTime = False):
    dt=datetime.datetime.fromtimestamp(milli / 1000.0)
    sdt = str(dt.year) + "-" + str(dt.month).rjust(2, '0') + "-" + str(dt.day).rjust(2, '0')
    if showTime:
        sdt = sdt + " " + str(dt.hour).rjust(2, '0') + ":" + str(dt.minute).rjust(2, '0')
    return sdt

C_WA = "àâäôóéèëêïîçùûüÿÀÂÄÔÉÈËÊÏÎŸÇÙÛÜ()"
C_NA = "aaaooeeeeiicuuuyAAAOEEEEIIYCUUU  "    
def scanName(name):
    for car in name:
        if (C_WA.find(car)) > -1:
            pos = C_WA.find(car)
            name = name.replace(car, C_NA[pos:pos+1], 1)
    return name.upper()

def showWebURL(url):
    webbrowser.open_new_tab(url)
    
def webCallClub(e, val = 0):
    id = e.widget._values
    if val:
        url = id[val]
    else:
        url = "https://cdore.ddns.net/ficheClub.html?data=" + str(id[val])
    
    showWebURL(url)    


class VscrollFrame(ttk.Frame):
    def __init__(self, parent, *args, **kw):
        ttk.Frame.__init__(self, parent, *args, **kw)
        self.win = parent
        #Create a canvas object and a vertical scrollbar for scrolling it.
        vscrollbar = ttk.Scrollbar(self, orient=VERTICAL)
        vscrollbar.pack(fill=Y, side=RIGHT, expand=FALSE)
        self.canvas = tk.Canvas(self, bd=0, highlightthickness=0,
                                width = 200, height = 100,
                                yscrollcommand=vscrollbar.set)
                                
        self.canvas.pack(side=LEFT, fill=BOTH, expand=TRUE)
        vscrollbar.config(command = self.canvas.yview)
        
        # Create a frame inside the canvas which will be scrolled with it.
        self.interior = tk.Frame(self.canvas)       #, bg="grey" 
        self.interior.bind('<Configure>', self.configure_interior)
        self.canvas.bind('<Configure>', self.configure_canvas)
        self.interior_id = self.canvas.create_window(0, 0, window=self.interior, anchor=NW)

    def configure_interior(self, event):
        #Update the scrollbar to match the size of the inner frame.
        size = (self.interior.winfo_reqwidth(), self.interior.winfo_reqheight())
        self.canvas.config(scrollregion=(0,0, size[0], size[1]))
        if self.interior.winfo_reqwidth() != self.canvas.winfo_width():
            #Update the inner canvas's width to fit the inner frame
            self.canvas.config(width = self.interior.winfo_reqwidth())
            
    def configure_canvas(self, event):   
        if self.interior.winfo_reqwidth() != self.canvas.winfo_width():
            #Update the inner frame's width to fill the canvas
            self.canvas.itemconfigure(self.interior_id, width=self.canvas.winfo_width())
            
    def scroll(self, scrollTo = '1'):
        self.win.update_idletasks()
        self.canvas.yview_moveto(str(scrollTo))
        
            
class modalDialogWin():
    def __init__(self, win, title = "Dialogue modal", optionalObject = None, geometry = None, modal = True, show = True , *args, **kwargs):
        self.win = win              #Parent window
        self.title = title          #Modal window title
        self.obj = optionalObject   #Optionnal object Ex.: data
        self.geometry = geometry
        self.dframe = None
        self.pop = None
        self.modal = None
        self.isModal = modal
        if show:
            self.showDialog()
        
        
    def createDialog(self):
        self.pop = Toplevel(self.win)
        self.pop.title(self.title)
        self.pop.bind("<KeyRelease>", self.checkKey)
        #pdb.set_trace()
        if self.geometry and isinstance(self.geometry, str):
            self.pop.geometry(self.geometry)
        #self.pop.geometry("300x150")
        if os.name == 'nt' :
            self.pop.attributes('-toolwindow', True)  #Removing minimize/maximize buttons    
        self.pop.bind('<Destroy>', self.closemodal)
        self.dframe = Frame(self.pop)  # not ttk
        self.dframe.grid_rowconfigure(0, weight=1)
        self.dframe.grid_columnconfigure(0, weight=1)        
        
        t=self.win.geometry()
        di=t.split("x")
        w = eval(di[0])        
        self.modal = tk.Frame(self.win, background="")
        self.modal["width"] = eval(di[0])
        self.modal["height"] = eval(di[1].split("+")[0]) #eval(di[1]) - 10
        self.modal.place(x=0, y=0) 
        self.modal.bind("<Button-1>", self.clickModal)

    def createWidget(self):
        #To rewrite for user 
        button1 = Button(self.dframe, text="Ok", command=self.close)
        button1.grid(row=2, column=1)
        
    def showDialog(self, event=None):
        self.createDialog()
        x = self.win.winfo_x()
        y = self.win.winfo_y()
        pos = "+%d+%d" % (x + 70, y + 70)
        self.pop.geometry(pos)
        self.createWidget()
        self.dframe.pack(expand= True, fill=BOTH, padx=5, pady=3, anchor=CENTER)
        self.pop.focus()
        
    def close(self, event = None):
        self.closepop()
        self.modal.destroy()
    def closepop(self):
        self.pop.destroy()
    def closemodal(self, e):
        
        self.modal.destroy()
        
    def clickModal(self, e):
        self.closepop()
        if self.isModal:
            self.win.bell()
            self.showDialog()
            

    def checkKey(self, event):
        #print(event.keysym, event.keysym=='a')
        #print(event)
        if event.keycode==27:
            self.close()
    
    
class RoundedButton(tk.Canvas):
    def __init__(self, parent, width, height, cornerradius, padding, color, bg, command=None, cursor=None):
        tk.Canvas.__init__(self, parent, borderwidth=1, 
            relief="flat", highlightthickness=0, bg=bg, cursor="hand2")
        self.command = command
            
        if cornerradius > 0.5*width:
            print("Error: cornerradius is greater than width.")
            return None

        if cornerradius > 0.5*height:
            print("Error: cornerradius is greater than height.")
            return None

        rad = 2*cornerradius
        def shape():
            self.create_polygon((padding,height-cornerradius-padding,padding,cornerradius+padding,padding+cornerradius,padding,width-padding-cornerradius,padding,width-padding,cornerradius+padding,width-padding,height-cornerradius-padding,width-padding-cornerradius,height-padding,padding+cornerradius,height-padding), fill=color, outline=color)
            self.create_arc((padding,padding+rad,padding+rad,padding), start=90, extent=90, fill=color, outline=color)
            self.create_arc((width-padding-rad,padding,width-padding,padding+rad), start=0, extent=90, fill=color, outline=color)
            self.create_arc((width-padding,height-rad-padding,width-padding-rad,height-padding), start=270, extent=90, fill=color, outline=color)
            self.create_arc((padding,height-padding-rad,padding+rad,height-padding), start=180, extent=90, fill=color, outline=color)


        id = shape()
        (x0,y0,x1,y1)  = self.bbox("all")
        width = (x1-x0)
        height = (y1-y0)
        self.configure(width=width, height=height)
        self.bind("<ButtonPress-1>", self._on_press)
        self.bind("<ButtonRelease-1>", self._on_release)


    def _on_press(self, event):
        self.configure(relief="sunken", borderwidth=1)

    def _on_release(self, event):
        self.configure(relief="raised", borderwidth=0)
        if self.command is not None:
            self.command()
            
class messageObj():
    def __init__(self, parent, objToBind = None, height=0):
        self.parent = parent
        self.height = height
        self.objToBind = objToBind  #Object to click to clear message
        self.messframe = tk.Frame(self.parent)  #, height=height
        self.messframe.pack(fill=X)
        self.messValue = StringVar()
        self.messLabel = tk.Label(self.messframe, textvariable=self.messValue, font=('Calibri 12'))       
        self.messLabel.pack(expand= True,fill=X)        

    def showMess(self, message, type = "E", color = ""):
        
        if color == "" :
            color = '#f00' # color = rouge par défaut
            if type == "I":
                color = "#22B14C"   # Si type = Information: color = vert
        self.clearMess()
        self.messValue.set(message)
        #pdb.set_trace()
        self.parent.update_idletasks()
        w = self.messframe.winfo_width() 
        #print(str(w))
        self.messLabel.config(wraplength=w)        
        self.messLabel.config(foreground= color)

        if not self.objToBind is None:
            self.objToBind.bind("<Button-1>", self.clearMess)

    def addMess(self, message, type = "E", color = ""):
        self.showMess(self.messValue.get() + message, type, color)

    def clearMess(self, event = None):
        self.messValue.set("")
        if not self.objToBind is None:
            self.objToBind.update_idletasks()
            self.objToBind.unbind("<Button-1>")
        if not self.messLabel is None:
            if self.messframe.winfo_height() > self.height:
                self.messframe.config(height=self.height)
                print(str(self.messframe.winfo_height()) + ", Adjust heigth to : " + str(self.height))
            self.messframe.update_idletasks()
        
class messageObj2():
    def __init__(self, parent, objToBind = None, height=0):
        self.parent = parent
        self.height = height
        self.objToBind = objToBind  #Object to click to clear message
        self.messLabel = None
        self.messframe = tk.Frame(self.parent, height=height)
        self.messframe.pack(fill=X)
        self.messValue = " "
        self.showMess(self.messValue)

    def showMess(self, message, type = "E", color = ""):
        #pdb.set_trace()
        if color == "" :
            color = '#f00' # color = rouge par défaut
            if type == "I":
                color = "#22B14C"   # Si type = Information: color = vert
        self.clearMess()
        self.messValue = message
        self.messLabel = tk.Label(self.messframe, font=('Calibri 12'), fg= color)
        self.messLabel.config(text= message)

        w = self.messframe.winfo_width() - 50
        self.messLabel.config(wraplength=w)
        self.messLabel.pack(expand= True, fill=X)
        #self.messLabel.pack( )
        if not self.objToBind is None:
            self.objToBind.bind("<Button-1>", self.clearMess)

    def addMess(self, message, type = "E", color = ""):
        #pdb.set_trace()
        self.showMess(self.messValue + message, type, color)
        if color == "" :
            x=1
            
    def clearMess(self, event = None):
        if not self.objToBind is None:
            self.objToBind.update_idletasks()
            self.objToBind.unbind("<Button-1>")
        if not self.messLabel is None:
            self.messLabel.destroy()
            self.messframe.config(height=self.height)
            self.messframe.update_idletasks()
                
class imageObj():
    def __init__(self, parentObj, parentContainer, imgURL = "", dim = (2,1),*args, **kwargs):
        self.objToBind = parentObj
        self.imgCont = parentContainer
        self.imgURL = imgURL
        self.editMode = False
        self.localImage = ""
        self.labImg = Label(self.imgCont)
        self.width = dim[0]
        self.height = dim[1]
                
        if self.imgURL == "":
            self.showNoImage()
        else:
            self.objToBind.bind("<Enter>",self.showImg)
 
    def showNoImage(self, modify = False):
        self.labImg.config(text="Image\nϴ")
        self.labImg.config(font='Calibri 20')
        self.labImg.config(width= self.width)
        self.labImg.config(height= self.height)
        self.labImg.grid(row=0, column=0) 
        if modify:
            self.labImg = Label(self.imgCont, cursor="hand2")
            self.labImg.bind("<Button-1>", self.changeImage)

    def showImg(self, event = None, localPath = ""):
        self.objToBind.unbind("<Enter>")
        self.objToBind.config(cursor="watch")
        ht = 140
        #pdb.set_trace()
        if localPath: 
            self.labImg.destroy()
            self.labImg = Label(self.imgCont)
            self.recImage=Image.open(localPath)
            self.labImg.bind("<Button-1>", self.modifImage)  
        else:
            cover = self.imgURL
            raw_data = urllib.request.urlopen(cover).read()
            self.recImage = Image.open(io.BytesIO(raw_data))
            if self.editMode :
                self.labImg.bind("<Button-1>", self.modifImage)
            else:
                self.labImg.bind("<Button-1>", self.showImage)
        image = ImageTk.PhotoImage(self.recImage)
        lg = int(image.width() * (ht/image.height()))
        img=self.recImage.resize(( lg, ht))
        image = ImageTk.PhotoImage(img)
        self.labImg.config(image=image)
        self.labImg.config(cursor="hand2")
        self.labImg.photo = image
        self.labImg.grid(row=0, column=0)  
        
        self.objToBind.config(cursor="")

    def showImage(self, event):
        winImg = showRecImg(self.objToBind, "Image", self.recImage)
        #winImg.showDialog()
        
    def editImgage(self):
        self.labImg.config(cursor="hand2")
        self.editMode = True
        #pdb.set_trace()
        if self.imgURL :
            self.labImg.bind("<Button-1>", self.modifImage)
        else:
            self.labImg.bind("<Button-1>", self.changeImage)           

    def changeImage(self, event = None):
        file_path = filedialog.askopenfilename( title="Selectionner une image", filetypes=(("jpeg files", "*.jpg"), ("gif files", "*.gif*"), ("png files", "*.png")))

        if file_path:
            self.localImage = file_path
            self.showImg(False, file_path)    
    
    def modifImage(self, event):
        winImg = modifRecImg(self.objToBind, "Modifier image", self)
        #winImg.showDialog()    

    def deleteImage(self):
        self.labImg.config(image="")
        self.labImg.photo = ""
        self.imgURL = ""
        self.localImage = ""        
        self.showNoImage(True)
        self.labImg.bind("<Button-1>", self.changeImage)

    def saveImage(self):
        dl_url = ""
        if self.localImage:
            def readFile(fName):
                f = open(fName, "r")
                return f.read()
    
            upload_filename = ""
            pos = self.localImage.rfind('/')
            upload_filename=self.localImage[pos+1:]
            upload_file = os.path.normpath(os.path.join("", upload_filename))
            #pdb.set_trace()
            dbx = dropbox.Dropbox(readFile("" + "info"))

            file_to = "/" + upload_filename
            shutil.copy( self.localImage, os.getcwd())
            while True:
                try:
                    with open(upload_file, 'rb') as f:
                        dbx.files_upload(f.read(), file_to)
                    break
                except Exception as ex:
                    if 'WriteConflictError' in str(ex):
                        x = str(ObjectId())
                        p = file_to.rfind(".")
                        file_to = file_to[0:p] + x[-2:] + file_to[p:]
                    else:
                        break
                        return except_handler("addFile Dropbox", ex)

            link = dbx.sharing_create_shared_link(file_to)
            dl_url = link.url.replace("dl=0", "raw=1")
            os.remove(upload_filename)
        return dl_url    


        
class showRecImg(modalDialogWin):
    def createWidget(self):
        #self.pop.resizable(0, 0)
        lab0 = Label(self.dframe, text="Actuel = ", bg="white", pady=5)
        lab0.grid(row=0, column=0, columnspan=2, sticky=EW)
        
        ht = 500
        image = ImageTk.PhotoImage(self.obj)
        actH = image.height()
        lg = int(image.width() * (ht/image.height()))
        img=self.obj.resize(( lg, ht))
        image = ImageTk.PhotoImage(img)
        labImg = Label(self.dframe, image=image)
        labImg.photo = image
        labImg.grid(row=0, column=0)  
        labImg.bind("<Button-1>", self.close)
        self.pop.resizable(0, 0)   

class modifRecImg(modalDialogWin):
    def createWidget(self):

        datURL = self.obj.localImage if self.obj.localImage else self.obj.imgURL

        if datURL == '' or datURL == 'undefined' :
            txt = "Ajouter..."
        else:
            txt = "Remplacer..."
        button1 = Button(self.dframe, text= txt, command=self.changeImage, width=30)
        button1.grid(row=1, column=0, columnspan=2)
        button2 = Button(self.dframe, text="Supprimer...", command=self.deleteImage, width=30)
        button2.grid(row=2, column=0, columnspan=2)
        
        lab1 = Label(self.dframe, text=" ")
        lab1.grid(row=3, column=0, columnspan=2, pady=5)

        buttonC = Button(self.dframe, text="Fermer", command=self.close, width=10) 
        buttonC.grid(row=4, column=0)
        buttonC.grid_rowconfigure(4, weight=1)
        buttonC.grid_columnconfigure(4, weight=1)        

    def changeImage(self):
        self.close()
        self.obj.changeImage()
 
    def deleteImage(self):
        answer = askyesno(title='Suppression de l\'image',
            message='Supprimer l\'image de la recette ? ')
        if answer:
            self.close()
            self.obj.deleteImage()
            
            
class menuEdit():
    def __init__(self, parentWin, inputToBind, *args, **kwargs):
        self.win = parentWin
        self.inputToBind = inputToBind  #Object to right click to pop menuEdit
        self.menu = Menu(self.win,tearoff=0) # Create a menu
        self.menu.add_command(label='Couper',command=self.cut, accelerator="Ctrl+X") # Create labels and commands
        self.menu.add_command(label='Copier',command=self.copy, accelerator="Ctrl+C") 
        self.menu.add_command(label='Coller',command=self.paste, accelerator="Ctrl+V")
        self.menu.add_command(label='Sélectionner tout',command=self.selectAll, accelerator="Ctrl+A")
        
        self.inputToBind.bind('<Button-3>',self.popup) # Bind to right click

    def popup(self, event):
        try:
            self.menu.tk_popup(event.x_root,event.y_root) # Pop the menu up in the given coordinates
        finally:
            self.menu.grab_release() # Release it once an option is selected

    def cut(self):
        self.inputToBind.event_generate("<<Cut>>")
        
    def paste(self):
        self.inputToBind.event_generate("<<Paste>>")

    def copy(self):
        self.inputToBind.event_generate("<<Copy>>")

    def selectAll(self):
        if isinstance(self.inputToBind, tk.Entry):
            self.inputToBind.select_range(0, 'end')
        else:
            lines = len(self.inputToBind.get("1.0", "end").split('\n'))
            for nl in range(1,lines):
                self.inputToBind.tag_add('sel', '{}.0'.format(nl), '{}.end'.format(nl))


class editEntry(tk.Entry):
    def __init__(self, parent=None, width=None, textvariable=None, state=None, validate="key", isNum=False, maxlen=None, font='', fg='black', bg='white'):
        if font:
            tk.Entry.__init__(self, parent, textvariable=textvariable, width=width, state=state, validate=validate, font=font, fg=fg, bg=bg)
        else:
            tk.Entry.__init__(self, parent, textvariable=textvariable, width=width, state=state, validate=validate)
        self.win = parent.win
        self.cntTry = 0
        self.maxlen = maxlen
        menuEdit(parent.win, self)
        if maxlen:
            self.config(validatecommand=(parent.register(self.validate), '%P', maxlen, isNum))
        
    def validate(self, P, maxlen, isNum):
        #pdb.set_trace()
        if isNum == 'True' and not (str.isdigit(P) or P == ""):
            self.win.bell()
            return False
        else:
            if len(P) <= int(maxlen):
                return True
            else:
                self.win.bell()
                if self.cntTry > 2:
                    num = " numériques." if isNum=='True' else "."
                    messagebox.showinfo(
                        title="Maximum atteint",
                        message=f"Ce champ a une longeur maximale de " + str(self.maxlen) + " caractères" + num) 
                    self.cntTry = 0
                else:
                    self.cntTry += 1
                    
                return False
            
            
class resizeFrame(tk.Frame):
    def __init__(self, parent=None, borderwidth = None, relief=None, bg = None, pack = True):
        tk.Frame.__init__(self, parent, borderwidth = borderwidth, relief=relief, bg=bg)
        self.win = parent
        if pack:
            self.pack(expand=YES, fill=BOTH, padx=10, pady=10)            
            
            
            
class selectDate(modalDialogWin):
    def __init__(self, win, title = "Dialogue modal", optionalObject = None, geometry = None, theDate = None):
        modalDialogWin.__init__(self, win=win, title = title, optionalObject = optionalObject, geometry = geometry, show = False)
        self.theDate = theDate

        #geometry = 1, 1.5, 2 , 2,3, 3...
        adjX = 1 + geometry / 10
        retX, retY, tFont, wh = int(-1 * geometry * adjX), int(-6 * geometry), int(12 * geometry)+1, int(10 * geometry)
        canvas = tk.Canvas(optionalObject, bg="white", borderwidth = 2, relief="raised")
        canvas.grid()
        txtid = canvas.create_text(retX, retY, text='📅', fill='blue', font=('Segoe', tFont), anchor='nw')  
        bbox = canvas.bbox(txtid)  
        canvas.configure(width=wh, height=wh) 
        canvas.grid(row=0, column=0) 
        Hovertip(canvas,"Calendrier")
        canvas.bind("<Button-1>", self.showDialog )

    
    def createWidget(self):
        self.pop.bind("<Double-Button-1>", self.selDate)
        self.seldate = self.obj
        self.cal = Calendar(self.pop, selectmode = 'day',date_pattern="y-mm-dd")
        self.cal.pack()
        
        butFrame = tk.Frame(self.pop)
        butFrame.pack(pady = 5)
        buttonC = ttk.Button(butFrame, text="Ok", command=self.selDate, width=10)
        buttonC.grid(row=0, column=0, padx = 15) 
        buttonC = ttk.Button(butFrame, text="Annuler", command=self.close, width=10)
        buttonC.grid(row=0, column=1, padx = 15)        

    def selDate(self, event = None):
        seldate = self.cal.get_date()
        if isinstance(self.theDate, StringVar):
            self.theDate.set(seldate)
        if isinstance(self.seldate, str):
            self.theDate = seldate    
        if isinstance(self.seldate, list):
            self.theDate.append(seldate)
            self.theDate.append(datetime.datetime.strptime(seldate, "%Y-%m-%d"))
        dt = datetime.datetime.strptime(seldate, "%Y-%m-%d")
        self.close()            
        
        
class sortGridObj():
    def __init__(self, headFrame, headLabels, headConfig, toolTip = []):
        self.colNbr = len(headLabels)
        self.headLabels = headLabels
        self.gridframe = None
        self.colHeadObj = []
            
        for col in range(self.colNbr):
            lbl = tk.Label(headFrame, text= headLabels[col], bg="lightgrey", pady=10, width= headConfig[col]["length"], borderwidth = 1, relief=RIDGE )
            lbl.grid(row=0, column= col, sticky=tk.NSEW)
            tt = toolTip[col] + "\n" if toolTip else ""
            tt += "Cliquer pour trier"
            Hovertip(lbl,tt)
            self.colHeadObj.append(lbl)
                   
        for col in range(self.colNbr):
            self.colHeadObj[col].bind("<Button-1>", lambda event, colHeadObj = self.colHeadObj, labels = headLabels, col= col, typ=headConfig[col]["type"]: self.sortCol(event, colHeadObj, labels, col, typ)) 

    def setGridframe(self, gridframe):
        self.gridframe = gridframe      
        
    def sortGrid(self, colSort, typ="N", reverse=False):
        otherCol = "col_labels_list"
        colNbr = self.colNbr

        #get data
        sort_label = self.gridframe.grid_slaves(column=colSort)
        for col in range(colNbr):
            globals()[otherCol + str(col)] = self.gridframe.grid_slaves(column=col)

        lenList = len(sort_label)
        label_values=[]
        data=defaultdict(list)
        #pdb.set_trace()
        for idx,_ in enumerate(sort_label):
            label=self.gridframe.grid_slaves(row=idx,column=colSort)[0]
            data[label].append(label['text'])
            if typ=="N":
                label_values.append(int(label['text']))
            else:
                label_values.append(label['text'])

        #sort data grid
        sort=sorted(label_values,reverse=reverse)
        arrPos = []
        for idx,value in enumerate(sort):
            pos=0
            for v in globals()[otherCol + str(colSort)]:
                if v["text"] == str(value) and not pos in arrPos:
                    #label.grid(row=idx, column=colSort)
                    for col in range(colNbr):
                        globals()[otherCol + str(col)][pos].grid(row=idx, column=col)

                    arrPos.append(pos)
                    break
                pos += 1   
        #pdb.set_trace()
        x=2
            

    def sortCol(self, event, colHeadObj, labels, col, typ):
        #pdb.set_trace()
        colNbr = len(labels)
        
        if "▲" in event.widget["text"]:
            event.widget["text"] = labels[col] + "▼"
            reverse=True
        else:
            event.widget["text"] = labels[col] + "▲"
            reverse=False  

        for colN in range(colNbr):
            if colN != col:
                colHeadObj[colN]["text"] = labels[colN]           
        self.sortGrid(col, typ, reverse)


class progressBarObj():
    def __init__(self, parent, height=10, column = None):
        self.parent = parent
        self.height = height
        #pdb.set_trace()
        self.width=self.parent.winfo_width()
        if self.width < 5:
            self.width = 280

        if not column is None:
            self.pbZone = tk.Frame(self.parent, bg="blue", width=self.width)
            self.pbZone.grid(column=0, row=0, padx=0, pady=0)            
        else:
            self.pbZone = tk.Frame(self.parent, bg="blue", width=self.width)
            self.pbZone.pack(fill=X)           

        self.sizeZone = tk.Frame(self.pbZone, height=self.height, width=self.width, padx=10)        
        self.sizeZone.pack(expand= True, fill=X)
        self.sizeZone.pack_propagate(0)

        # progressbar
        self.pBar = ttk.Progressbar(
            self.sizeZone,
            orient='horizontal',
            mode='determinate',
            length=self.width
        )

    def showBar(self):
        #self.pbZone.pack(fill=X)
        self.pBar.pack()

    def hideBar(self):
        self.pBar.pack_forget()

    def progress(self, percentVal = 20):
        if self.pBar['value'] < 100:
            self.pBar['value'] += percentVal
        self.parent.update_idletasks()
        
    def kill(self):
        self.pbZone.destroy()


# Logon modal dialog
class logonBDdialog(simpledialog.Dialog):
    def body(self, master):
        self.connectArr = []

        self.titleframe = tk.Frame(master)
        self.titleframe.grid(row=0)        
        lblTitle = tk.Label(self.titleframe, text="Connexion à la BD", font=('Calibri 12 bold')).grid(row=0)
        #lblTitle.pack()
        
        self.formframe = tk.Frame(master, borderwidth = 1, relief=RIDGE, padx=10, pady=10)
        self.formframe.grid(row=1)
        tk.Label(self.formframe, text="User :").grid(row=0, sticky=E)
        self.entry = tk.Entry(self.formframe, width=30)
        self.entry.grid(row=0, column=1)
        tk.Label(self.formframe, text="Password :").grid(row=1, sticky=E)
        self.passentry = tk.Entry(self.formframe,show="*", width=30)
        self.passentry.grid(row=1, column=1)        
        return self.entry  # Mettez le focus sur le champ de saisie

    def validate(self):
        self.connectArr.append(self.entry.get())
        self.connectArr.append(self.passentry.get())       
        return True
            
    def apply(self):
        # Cette méthode est appelée lorsque le bouton "OK" est cliqué
        #pdb.set_trace()
        self.result = self.connectArr   #Permet de récupérer les valeurs dans un array

class logonAPPdialog(logonBDdialog):
    def __init__(self, parent, optionalObject = None):
        self.parent = parent
        self.obj = optionalObject[0]
        self.userIdent = optionalObject[1]
        logonBDdialog.__init__(self, parent)
 
    def body(self, master):
        logonBDdialog.body(self, master)
        self.entry.insert(0, self.userIdent)
        self.titleframe = tk.Frame(master)
        self.titleframe.grid(row=0)  
        lblTitle = tk.Label(self.titleframe, text="S'authentifier à l'application.", width=40, font=('Calibri 12 bold'))
        lblTitle.pack()        
        self.objMess = messageObj(self.titleframe)

        return self.entry  # Mettre le focus sur le champ de saisie

    def validate(self):
        ident = self.entry.get()
        password = self.passentry.get()

        res = self.getUserPass(ident, password)

        if len(res) == 0:
            self.objMess.showMess("Identifiant/mot de passe inconnu.")
            return False
        else:
            if not res[0]["actif"]:
                self.objMess.showMess("Utilisateur inactif.")
                return False
            else:
                self.connectArr.append(self.entry.get())
                dt = datetime.datetime.now()    #Date actuelle
                #pdb.set_trace()
                self.connectArr.append(dt.timestamp() * 1000 + 172800000)  #Date actuelle + 2 jours
                self.connectArr.append(res[0]["Nom"])
                self.connectArr.append(res[0]["niveau"])
                self.connectArr.append(res[0]["_id"])
                return True

    def getUserPass(self, ident, password):
        col = self.obj.users
        dat = col.find({"courriel": ident , "motpass": password})
        return list(dat)
        
class changePassAPPdialog(logonAPPdialog):
    def __init__(self, parent, optionalObject = None):
        self.parent = parent
        logonAPPdialog.__init__(self, parent, optionalObject)
 
    def body(self, master):
        #pdb.set_trace()
        logonBDdialog.body(self, master)
        self.entry.insert(0, self.userIdent)
        self.entry.config(state="disable")
        self.titleframe = tk.Frame(master)
        self.titleframe.grid(row=0)   
        lblTitle = tk.Label(self.titleframe, text="Changer le mot de passe", width=40, font=('Calibri 12 bold'))
        lblTitle.pack()    
        self.objMess = messageObj(self.titleframe)       
        
        tk.Label(self.formframe, text="Nouveau mot de passe :").grid(row=2, sticky=E)
        self.newpassentry = tk.Entry(self.formframe,show="*", width=30)
        self.newpassentry.grid(row=2, column=1)   
        tk.Label(self.formframe, text="Confirmer mot de passe :").grid(row=3, sticky=E)
        self.confpassentry = tk.Entry(self.formframe,show="*", width=30)
        self.confpassentry.grid(row=3, column=1) 
        return self.passentry  # Mettre le focus sur le champ password

    def validate(self):
        ident = self.entry.get()
        password = self.passentry.get()
        newpass = self.newpassentry.get()
        confpass = self.confpassentry.get()

        res = self.getUserPass(ident, password)
        
        if len(res) == 0:
            self.objMess.showMess("Identifiant/mot de passe inconnu.")
            return False
        else:
            if newpass == "" or newpass != confpass:
                self.objMess.showMess("Échec de la confirmation du mot de passe.")
            else:
                if len(newpass) < 3:
                    self.objMess.showMess("Longeur minimum de 3 caractères du mot de passe.")
                else:
                    self.changeUserPass(res[0]["_id"], newpass)
                    return True

    def changeUserPass(self, id, password):
        col = self.obj.users
        dat = col.update_one({"_id": id} , { "$set": {"motpass": password}})
            


class changeBDpass(logonBDdialog):
    def __init__(self, parent, optionalObject = None):
        self.parent = parent
        self.obj = optionalObject[0]
        self.userIdent = optionalObject[1]
        logonBDdialog.__init__(self, parent)
 
    def body(self, master):
        logonBDdialog.body(self, master)
        self.entry.insert(0, self.userIdent)
        
        lblTitle = tk.Label(self.titleframe, text="Change password", font=('Calibri 12 bold')).grid(row=0)

        self.passentry.config(show="")

class adminBDpass(logonBDdialog):
    def __init__(self, parent, optionalObject = None):
        self.parent = parent
        self.obj = optionalObject[0]
        self.userIdent = optionalObject[1][0]
        self.password = optionalObject[1][1]
        self.chkUser = IntVar()
        logonBDdialog.__init__(self, parent)
 
    def body(self, master):
        logonBDdialog.body(self, master)
        self.entry.insert(0, self.userIdent)
        
        lblTitle = tk.Label(self.titleframe, text="   User admin database  ", font=('Calibri 12 bold')).grid(row=0)
        tk.Label(self.titleframe, text="Use root admin database user ").grid(row=1)
        tk.Label(self.titleframe, text="or [recommanded]").grid(row=2)
        tk.Label(self.titleframe, text="admin user database user with list collections privilege.").grid(row=3)
        
        tk.Label(self.formframe, text="Remember :").grid(row=3, column=0, sticky=E)
        chxframe = tk.Frame(self.formframe)
        chxframe.grid(row=3, column=1, sticky=tk.W)
        self.chkUser = IntVar()
        user_check = ttk.Checkbutton(
            chxframe,
            text="User   ",
            variable=self.chkUser,
            onvalue=1,
            offvalue=0)
        user_check.grid(row=0, column=0, sticky=tk.W, padx=5, pady=3)
        #pdb.set_trace()
        if self.userIdent:
            self.chkUser.set(1)        
        self.chkPass = IntVar()
        pass_check = ttk.Checkbutton(
            chxframe,
            text="Password",
            variable=self.chkPass,
            onvalue=1,
            offvalue=0)
        pass_check.grid(row=0, column=1, sticky=tk.W, padx=5, pady=3)        
        if self.password:
            self.chkPass.set(1)      
            
    def apply(self):
        # Cette méthode est appelée lorsque le bouton "OK" est cliqué
        #pdb.set_trace()
        self.result = [self.connectArr, self.chkUser.get(), self.chkPass.get()]

        
class logonWin:
    def __init__(self, root, optionalObject = None):
        self.root = root
        self.obj = optionalObject
        
    def showLogonBD(self):
        custom_dialog = logonBDdialog(self.root)
        return custom_dialog.result #Retourner les valeurs par le bouton Ok, sinon None
        
    def showAPPdialog(self, userIdent = None):
        custom_dialog = logonAPPdialog(self.root, [self.obj, userIdent])
        return custom_dialog.result #Retourner les valeurs par le bouton Ok, sinon None        

    def showChangePassdialog(self, userIdent = None):
        custom_dialog = changePassAPPdialog(self.root, [self.obj, userIdent])
        return custom_dialog.result #Retourner les valeurs par le bouton Ok, sinon None 

    def showChangeBDpass(self, userIdent = ""):
        custom_dialog = changeBDpass(self.root, [self.obj, userIdent])
        return custom_dialog.result #Retourner les valeurs par le bouton Ok, sinon None   

    def showAdminUserBD(self, userIdent = ""):
        #pdb.set_trace()
        custom_dialog = adminBDpass(self.root, [self.obj, userIdent])
        return custom_dialog.result #Retourner les valeurs par le bouton Ok, sinon None   
        
# FIN Logon modal dialog
