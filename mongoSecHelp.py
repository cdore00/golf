
cssTxt = """
#toc {
  float: right;
  margin: 1em 1em 1em 1em;
  padding: 1em;

}

#toc ul, #toc li {
  display: block;
  margin: 0;
  padding: 0;
}
#toc li {
  margin-left: 3ex;
  display: list-item;
  list-style-type: decimal;
}
#toc h3 {
  margin-top: 0;
}

body {
  background-color: #d9d9d9;
}
h1 {
  text-align: center;
  margin: 1em;
}

table {
  margin: 1em auto;
}

#sitemap {
  max-width:720px;
  margin:auto;
  position: relative;
}

#sitemap h3 {
  display: none;
}
#sitemap table {
  overflow: auto;
  margin:auto;
  line-height: 1.5em;
  padding: 0px;
  border-spacing: 0px;
}
#sitemap tr {
  border-spacing: 0px;
}
#sitemap td {
  border: black 1px solid;
  border-bottom: none;
}
#sitemap td.spacer {
  border: none;
}
#sitemap a[href] {
  display: block;
  padding: 0.5em 1em 0px 1em;
  text-decoration: none;
  color: black
}
#sitemap .caption {
  display: none;
}

#sitemap td:hover .caption {
  display: block;
  position: absolute;
  top: 110%;
  left: 25%;
  right: 25%;
  display: block;
  border: 1px solid black;
  background-color: #ececec;
  padding: 0px 0.5em;
}
#sitemap #active .caption {
  display: none;
  position: static;
}

#sitemap a[href] {
  border-bottom: none;
  background-color: transparent;
}
#sitemap td:hover {
  background-color: #ececec;
}
#sitemap #active {
  background-color: white;
}

#body {
  text-align: left;
  border: black 1px solid;
  padding: 0px 0.5em;
  max-width: 720px;
  margin: auto;
  background-color: white;
}

a[href]:hover {
  background-color: #ececec;
  color: black;
  border-bottom: solid black 1px;
  text-decoration: none;
}


.codearea { 
  padding: 0.5em; 
  margin: 1em; 
  background-color: #eee;
  overflow: scroll;
 
}

.breakwrap {
word-wrap: break-word !important;


}

.margL4 {
    margin-left:4ex
}

.margL8 {
    margin-left:8ex
}
.margR8 {
    margin-right:8ex
}

.margTitle {
    margin-top:2ex;
    margin-bottom:1ex;
    margin-left:6ex;
    font-weight:bold
}

.mmdb {
  font-weight: bold;
  font: 5px;
}

.appins {
background: #efffef;
]



"""

htmlHelp = """

<html>
<head>
 
       </head>
       <body>

       <h1>Manage MongoDB Security - (MMDBS) Help</h1>
	
	<a name="topMenu">
       <div class="sidebox"><div id="toc">
         <a name="TOC"><h3>Table Of Contents</h3></a>
         <a name="index"></a><ul><li><a href="#section0">MongoDb installation</a><li><a href="#section1">Users and roles</a><li><a href="#section3">Enable authentication</a></ul>
       </div></div>
	</a>

 <div><h2><a name="section0" style="display: inline;">MongoDB installation</a><a href="#topMenu" style="margin-left:10px; display: inline-block; border: 1px ridge #0000aa;">▲</a></h2></div>
 
 <p>To install MongoDB for the first time, you can follow general steps.</br> 
 The process may vary slightly depending on your operating system.</br> 
 <a target="_blank" href="https://www.mongodb.com/docs/manual/installation/" >Here</a>, are covered the installations for Windows, macOS, and Linux.</p>
 
 <p>By default, MongoDB allows connections without authentication. It's crucial to enable authentication to ensure that only authorized users can access the database.</p>
 
  <div class="mmdb">(MMDBS)</div>
<div class="appins">
<p> 
<div>In file menu option «<code>Connect to...</code>» the default «<code>localhost</code>» is present, after instalation. </div>
 <div>The title bar indicate «Connected» if MongoDb is present, otherwise «Not connected", after connection timeout.</div>
 <div>At this step, the «<code>Sign in...</code>» file menu option, is not required. </div></p>
</div>

<p>Install <a href="https://www.mongodb.com/docs/compass/current/install/">MongoDB Compass</a> to manage MongoDB database contents.
<div>You can use «<code>Connection string...</code>» file menu option, copy/paste to connect with MongoDB Compass.</div>
</p>


 <div><h2><a name="section1" style="display: inline;">Users and roles</a><a href="#topMenu" style="margin-left:10px; display: inline-block; border: 1px ridge #0000aa;">▲</a></h2></div>
 
<p>In MongoDB, as in any database, users and roles are fundamental components of the access control system. Here's a brief overview of users and roles in MongoDB:</p>
<div class="appins">
<p><div>Use this control <div style="display: inline; font-size: 1.5em; font-weight: bold; text-align: center; border: buttonhighlight 2px outset;">&nbsp;...&nbsp;</div> in User and Role tabs to modify or create them.</div></p>
</div>
        <div class="margTitle">User:</div>
        <div class="margL8">A user is an account that can authenticate and interact with a MongoDB database.
        Users are defined at the database level.
        Each user has a unique name within a database.</div>

        <div class="margTitle">Roles:</div>
        <div class="margL8">A role is a set of privileges that determine the actions a user can perform,
		on a database or collections within that database.
        MongoDB provides several built-in roles, each with a specific set of privileges. 
		Examples include read, readWrite, dbAdmin, userAdmin, etc.
        Roles can be customized to grant specific permissions beyond the built-in roles.</div>

        <div class="margTitle">Privileges:</div>
        <div class="margL8">Privileges are the specific actions or operations that a user can perform.
        Privileges are assigned to roles, and roles are then assigned to users.
        Examples of privileges include read, readWrite, dbAdmin, userAdmin, etc.</div>   
        
        <div class="margTitle">Database-level Roles:</div>
        <div class="margL8">Database-level roles define privileges at the level of a specific database.
        Examples of <a href="https://www.mongodb.com/docs/manual/reference/built-in-roles/#database-user-roles" >built-in database-level roles</a> include read, readWrite, dbAdmin, userAdmin, etc.</div>
        
        <div class="margTitle">Cluster-level Roles:</div>
        <div class="margL8">Cluster-level roles define privileges at the cluster level,
		allowing actions that affect the entire MongoDB deployment.
        Examples of <a href="https://www.mongodb.com/docs/manual/reference/built-in-roles/#cluster-administration-roles" >built-in cluster-level roles</a> include clusterAdmin,
		readAnyDatabase, root, etc.</div>


<div><h2><a name="section3" style="display: inline;">Enable authentication</a><a href="#topMenu" style="margin-left:10px; display: inline-block; border: 1px ridge #0000aa;">▲</a></h2></div>

<P>For authentication, MongoDB supports various Authentication Mechanisms.</P>

<p id="4ae1">To enable authentication in mongod configuration file: Open <a href="https://www.mongodb.com/docs/v4.4/reference/configuration-options/#std-label-configuration-options">configuration file</a> with a text editor and search for the following lines:</p>

<div class="margL8 margR8"><div class="codearea">
<pre><span id="fed9">security:<br>    authorization: <strong>"disabled</strong>"</span></pre>
</div></div>

<p>Change <code>"<strong>disable</strong>"</code> for <code>"<strong>enabled</strong>"</code>, save the file and restart <code>mongod</code> service.</p>

<div class="margTitle">For Linux :</div>
<div class="margL8">Configuration file : ( <strong>/etc/mongod.conf</strong> ).</div>

<div class="margL8">To restart mongod service.</div>
<div class="margL8 margR8"><div class="codearea">
$ sudo systemctl restart mongod
</div></div>

<div class="margL8">OR</div>
<div class="margL8 margR8"><div class="codearea">
$ sudo service mongod restart
</div></div>

<div class="margTitle">For Windows :</div>
<div class="margL8">Configuration file : ( <strong>« install directory »\\bin\mongod.cfg ).</div>
<div class="margL8">To restart mongod service, launch <a href="ServicesConsole">Services Console</a> and restart <strong>MongoDB Server</strong> service.</div>

<div class="appins">
<p><div>After this step, the «<code>Sign in...</code>» file menu option, is required to authenticate the database connection. </div></p>
</div>


<h3>TLS</h3>
<p>Using TLS (Transport Layer Security) with MongoDB provides several benefits related to security and data integrity. TLS encrypts the communication between the MongoDB server and its clients. </p>

<div>A TLS certificate can be obtained from a trusted certificate authority (CA).</div>
<div>OR</div>
<div>A self-signed TLS certificate (x509) can be created with OpenSSL tool.</div>
<div class="margL4">In that case, a Combined PEM File (Private Key + Certificate) and the non secure option must be use with MongoDB, that is not very secure, but the communication with the server will be encrypted.</div>

<div class="margL4"><a href="https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#mongod-and-mongos-certificate-key-file">See MongoDB documentation</a></div>


<h4>To generagte a self-signed TLS certificate (x509)</h4>

<div class="margL8">Generating Certificate Authority (CA)</div>
<div class="margL8 margR8"><div class="codearea">
<pre><code>
openssl genrsa -out ca.key 2048
openssl req -x509 -new -nodes -key ca.key -days 3650 -subj '/CN=myCA/OU=myOrgUnitAdmin/O=myOrg/L=myLocality/ST=myState/C=CA' -out ca.crt
</code></pre>
</div></div>

<div class="margL8">Generating the server x.509 Certificate files</div>
<div class="margL8 margR8"><div class="codearea">
<pre><code>
openssl req -newkey rsa:2048 -days 3650 -nodes -subj '/CN=localhost/OU=myOrgUnitAdmin/O=myOrg/L=myLocality/ST=myState/C=CA' -out server.csr -keyout server.key
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650 -extfile &lt;(echo -e "keyUsage = digitalSignature, keyEncipherment&#92;nextendedKeyUsage = serverAuth")
#Create combined PEM File (Private Key + Certificate)
cat server.key server.crt &gt; server.pem
</code>
</pre>
</div></div>

<div class="margL8">Generating the client x.509 Certificate files</div>
<div class="margL8 margR8"><div class="codearea">
<pre><code>
openssl req -newkey rsa:2048 -days 3650 -nodes -subj '/CN=x509user/OU=myOrgUnitAdmin/O=myOrg/L=myLocality/ST=myState/C=CA' -out client.csr -keyout client.key
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 3650 -extfile &lt;((echo -e "keyUsage = digitalSignature, keyEncipherment&#92;nextendedKeyUsage = clientAuth")
#Create combined PEM File (Private Key + Certificate)
cat client.key client.crt &gt; client.pem
</code></pre>
</div></div>

<h4>Use certificates in MongoDB</h4>




<p> &nbsp;</p>
       </div></div>
       </body>
       </html>

"""