# /etc/systemd/system/startapp.service    CALL
# /etc/rc.local    CALL
# location: /init
FILE=start.txt
FILE=${FILE%.*}_`date +%I:%M:%S`.${FILE#*.}
#sudo wall $FILE
sudo touch /home/$FILE
sleep 40s
sudo ip addr add 192.168.10.11/24 dev docker0
sleep 5
sudo docker start mon_golf
sleep 15
sudo docker start servDB2
sudo docker start webServ

exit 0
