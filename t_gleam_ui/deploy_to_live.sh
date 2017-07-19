#Currently
npm run build
find ./build -type f -name '*.map' -delete
cd build
scp -r -i /home/stevers/ssh/my.ssh ./ stephen.cryan@35.187.186.155:static
cd ..
ssh -i /home/stevers/ssh/my.ssh stephen.cryan@35.187.186.155 'bash -s' < deploy_to_live.ssh.sh
