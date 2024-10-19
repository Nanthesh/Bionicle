
Install Redis Using Windows Subsystem for Linux (WSL)
This method allows you to install Redis as it would be installed on a Linux system, but running it on Windows.

Step 1: Install WSL
Open PowerShell as Administrator.

Run the following command to enable WSL and install Ubuntu:

bash
Copy code
wsl --install
Once the installation is complete, restart your computer if prompted.

After restarting, open Ubuntu from the Start menu. This will complete the installation of Ubuntu.

Step 2: Install Redis on WSL
After Ubuntu opens, update your package list:

bash
Copy code
sudo apt update
Install Redis:

bash
Copy code
sudo apt install redis-server
Start the Redis server:

bash
Copy code
sudo service redis-server start
Verify that Redis is running by connecting to the Redis CLI:

bash
Copy code
redis-cli
In the Redis CLI, run the command PING. If Redis is running, it should respond with PONG.

Now, Redis is running on your system, and your Node.js application can connect to it at 127.0.0.1:6379.