# VMEmperor

## Configuration

File: `configs/config.ini`

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
3. [Adapt your Ansible playbooks](https://github.com/pashazz/vmemperor/wiki/AnsiblePlaybookConfigFormat), see example in `ansible` folder. You may want to use them as volume - edit `docker-compose.yml`
0. Generate SSH keys for access using Ansible:
```
ssh-keygen -f keys/id_rsa
```

5. Run `docker-compose up`


## How to configure (without Grafana)
#### Grafana is only available with docker-compose
  0. Ensure at least Python 3.7 on your host machine
  0. Set Up XenServer and provide XenServer URL as `url` config parameter
  0. [Set up RethinkDB](https://www.rethinkdb.com/docs/start-on-startup/). Don't forget `bind=127.0.0.1`
  0. Install ansible in order to use automation benefits
  0. Generate a SSH pubkey for ansible to use
  0. Set up config parameters as shown in Example
  0. Set up API URL for frontend:
      in `frontend/server/index.js` find:
      ```js
      const options = {
        target: 'http://localhost:8889',
      ```

        around line 38 and replace it with `http://localhost:vmemperor_port` (or another host if you plan to use frontend and backend on different hosts)

  0. Start RethinkDB
  0. Install VMEmperor dependencies with `pip install -r requirements.txt` (optionally create a virtualenv ). Install npm for managing frontend
  0. For `ispldap` set up LDAP server IP in `auth/ispldap.py:12`, variable `SERVER_IP`
  0. Optionally [Adapt your Ansible playbooks](https://github.com/pashazz/vmemperor/wiki/AnsiblePlaybookConfigFormat), see example in `ansible` folder
  0. change your directory to `/backend` and copy `/configs/config.ini` to there.
  0. Start VMEmperor with `python3 vmemperor.py`
  0. from `frontend` directory install dependencies with `npm install`
  0. run frontend with `npm run start`
