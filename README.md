# AlephBERT Production for sentence completion

## setup:
if you are using unix based machine (aka mac or linux),
you dont need to clone anything by yourself! run only `./setup.sh`.
note that if you don't download the tune file you won't be able to use the wiki hebrew tuned version, only the original model. if you will try to use the tuned model without completing the next step, the server will terminate.
### FineTune version setup:
if you want to use the wiki hebrew tuned version please contact authors to get access to **tune_6_10.pkl**, store it in the same dir with "setup.sh" and run `./setup.sh`. it will take care of the rest.
## setup from source (all users including windows users):
1. `git clone -b production https://github.com/maxkrakauer/BERT.git`
2. `cd BERT`
3. `mkdir AlephBERT-main/models/myFirstTune`
4. (optional) store tune_6_10.pkl in AlephBERT-main/models/myFirstTune
5. `cd ui/client`
6. `npm install`
7. `npm start`
8. open "http://localhost:8080"
### note:
if you havn't completed step number 4, you can only use original model. 

## Start up after installation:
if you're using mac OSX, the browser will be opened automaticaly in: "http://localhost:8080".
if you're using linux or you closed the browser, open your favorate browser and enter "http://localhost:8080".
if you already completed setup but the server port was closed, open terminal at BERT/ui/client
and enter `npm start`.
## Requirements
all requirement are handled in "setup.sh" but if you know what you're doing, and installing everything from source, the dependencies are:
#### python^3.8, git (latest), npm (latest)
### python3.8 modules:
*torch, transformers, pickle*
### nodejs modules:
*npm*

