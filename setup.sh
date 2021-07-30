#!/bin/bash
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
        # linux or mac
        echo 'working on linux or mac OSX'
        #installing git and npm:
        if [[ "$OSTYPE" == "darwin"* ]]; then
                # Mac OSX
                brew install npm git
        else
                #linux
                apt install npm git
        fi
        #installing pip:
        python -m ensurepip --upgrade
        #cloning the repository:
        git clone -b production https://github.com/maxkrakauer/BERT.git
        #check for tune file:
        FILE=tune_6_10.pkl
        if test -f "$FILE"; then
                printf "${GREEN}found tune_6_10.pkl! moving to correct path${NC}\n"
                mkdir BERT/AlephBERT-main/models/myFirstTune
                mv tune_6_10.pkl BERT/AlephBERT-main/models/myFirstTune/
        else
                printf "${RED}tune_6_10.pkl not found, only original model will work with the hebrew version.\nto use the wiki tuned hebrew version, please copy tune_6_10.pkl to: BERT/AlephBERT-main/models/myFirstTune.\nfor more details about tune_6_10.pkl, please contact the owner of the git repository.${NC}\n"
        fi
        #installing dependecies
        cd BERT
        pip install transformers
        pip install torch
        cd AlephBERT-main/models
        cd ../../ui/client
        #installing npm dependencies:
        npm install
        #lunching server!
        npm start
       
        
elif [[ "$OSTYPE" == "cygwin" ]]||[[ "$OSTYPE" == "msys" ]]; then
        # POSIX compatibility layer and Linux environment emulation for Windows
        # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
        echo 'working on windows'
        echo 'not supported yet :( terminating'
        # py -m ensurepip --upgrade
fi