# /etc/systemd/system/startapp.service    CALL
# /etc/rc.local    CALL
# location: /etc/init
sleep 40s
FILE=start.txt
FILE=${FILE%.*}_`date +%y-%m-%d:%H:%M:%S`.${FILE#*.}
#sudo wall $FILE
sudo touch /home/$FILE
sudo ip addr add 192.168.10.11/24 dev docker0
sleep 5
sudo docker start monDB
sleep 10
sudo docker start pytGolf
sudo docker start pytResto
sudo docker start webServ

exit 0
