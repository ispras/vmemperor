# VMEmperor

## Configuration

File: `login.ini`

### Example
```bash
debug = True # Debug
username = 'root' # XenServer root username
password = '!QAZxsw2' # XenServer root password
url = 'http://10.10.10.18:80/' # XenServer API URL
database = 'vmemperor' # RethinkDB database name
host = '127.0.0.1' # RethinkDB host
vmemperor_host ="10.10.10.102" # Your host's IP as seen by VMs (for postinstall script URL)
vmemperor_port = 8889 # VMEmperor API port
authenticator = 'ispldap' # Authenticator class
#authenticator='ispldap'
#log_events = 'vm,vm_metrics,vm_appliance,vm_guest_metrics.sr,vdi'
ansible_pubkey = '~/.ssh/id_rsa.pub' # Public key exported during auto installation for Ansible
ansible_networks = ["920b8d47-9945-63d8-4b04-ad06c65d950a"] # Networks that your host and VMs all run on
user_source_delay = 2 # How often VMEmperor asks external authenticator for user and group lists, in seconds
```
## How to configure with Docker

1. Configure `login.ini`.
   Leave the following options default:
      * `vmemperor_port` (Dockerfile assumes auto configuration of frontend and it uses default port)
      * `host` (Dockerfile assumes RethinkDB is running in the same Docker container)
2. Pay attention to `ansible_pubkey` variable: its default value assumes that you mount `/root` directory with `.ssh/id_rsa` and `.ssh/id_rsa.pub` files in container. If you change this value, correct `docker run` command accordingly
3. [Adapt your Ansible playbooks](https://github.com/pashazz/vmemperor/wiki/AnsiblePlaybookConfigFormat), see example in `ansible` folder. You may want to add them to Docker image or mount them as volume
3. Create Docker image:
```bash
docker build -t vmemperor .
```
3. Run Docker image:
```bash
docker run -d  -v ~/.ssh:/root/.ssh -p 3000:3000 -p 8889:8889 vmemperor:latest
```
Warning: You must expose both frontend and API ports for remote desktop and post-installation to work.
4. Open frontend at http://localhost:3000 (if no VMs are shown you probably should re-login)

## How to configure
  0. Ensure at least Python 3.7 on your host machine
  1. Set Up XenServer and provide XenServer URL as `url` config parameter
  2. [Set up RethinkDB](https://www.rethinkdb.com/docs/start-on-startup/). Don't forget `bind=127.0.0.1`
  3. Install ansible in order to use automation benefits
  4. Generate a SSH pubkey for ansible to use
  5. Set up config parameters as shown in Example
  6. Set up API URL for frontend:
      in `new-frontend/server/index.js` find:
      ```js
      const options = {
        target: 'http://localhost:8889',
      ```

        around line 38 and replace it with `http://localhost:vmemperor_port` (or another host if you plan to use frontend and backend on different hosts)

  7. Start RethinkDB
  8. Install VMEmperor dependencies with `pip install -r requirements.txt` (optionally create a virtualenv ). Install npm for managing frontend
  8. For `ispldap` set up LDAP server IP in `auth/ispldap.py:12`, variable `SERVER_IP`
  9. Start VMEmperor with `python3 vmemperor.py`
  10. from `new-frontend` directory install dependencies with `npm install`
  11. run frontend with `npm run start`
  12. Set up networks in your XenServer
  13. Set up CLI utility. Create a file `make_request.ini` with the following content:
  ```ini
[admin]
username=root
password=your_root_password
admin=True
  ```
  14. Provide access of desired networks to desired users using CLI:
  ` ./make_request.py --login admin setaccess <network uuid> --type="Network" --action="all" --user '<id>' `
  Or to groups:
  ` ./make_request.py --login admin setaccess <network uuid> --type="Network" --action="all" --groups '<id>' `
  To get user list, run
  `./make_request.py --login admin userlist`
  To get group list, run
  `./make_request.py --login admin grouplist`
  15. In XenCenter make desirable templates available to users by applying `vmemperor` tag
  16. [Adapt your Ansible playbooks](https://github.com/pashazz/vmemperor/wiki/AnsiblePlaybookConfigFormat), see example in `ansible` folder

# CLI interface
    ./make_request.py <action> <options>

## Configuration
File `make_request.ini`

Example:
```ini
[config] # Required section
host = localhost # VMEmperor host
port = 8889 # VMEmperor post

[login] # This login is default
username=john
password=john

[eva] # This login is specified as ./make_request.py --login eva <other arguments>
username=eva
password=eva

[mike]  # This login is specified as ./make_request.py --login make <other arguments>
username=mike
password=mike

[admin] # This login is specified as ./make_request.py --login admin <other arguments>
username=root
password=!QAZxsw2
admin=True # This indicates administrator accout
```


## Available actions
* `createvm` - Create VM
* `vminfo` - Get VM info
* `start` - Start VM
* `stop` - Stop VM
* `destroy` - Destroy VM
* `vnc` - Get VNC url (use WebSocket with this URL)
## Get help
    make_request.py <action> --help


## Example

### Create a VM named `vm1` with hostname `xenvm`

    ./make_request.py createvm --name_label "vm1" --hostname "xenvm"

## Output format
Line 1: API output<br>
Line 2: HTTP status code

### Example
    ./make_request.py createvm --name_label "test13" --hostname "test13"


# Use Auto-installation features
You need to tune up your template configuration in order to use auto installation features.

[Read more...](https://github.com/pashazz/vmemperor/wiki/XenServerTemplates)
