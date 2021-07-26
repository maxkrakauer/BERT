import torch
device = torch.device('cuda')
print(torch.cuda.is_available())
from transformers import BertForMaskedLM, BertTokenizerFast

from transformers import AdamW


alephbert_tokenizer = BertTokenizerFast.from_pretrained('onlplab/alephbert-base')
alephbert = BertForMaskedLM.from_pretrained('onlplab/alephbert-base', num_labels=2)
# alephbert.to(device)
alephbert.train()
# if not finetuning - disable dropout

import pandas as pd

with open('AlephBERT-main/data/wikipedia/wikipedia_FT.raw', 'r') as raw:
    raw_list = raw.read().split('.')
    l = len(raw_list)
    raw_list = raw_list[:l//100]
    striped_list = [sentence.strip() for sentence in raw_list]
    # len_of_sentences = [len(sentence.split()) for sentence in striped_list]
    # pd.Series(len_of_sentences).hist(bins = 50)
    # most of the data is ~25 long sentences...
    tokenized_text = alephbert_tokenizer(striped_list, padding='max_length', return_tensors='pt', truncation=True)
# dict_keys(['input_ids', 'token_type_ids', 'attention_mask'])

# adding labels to data
tokenized_text['labels'] = tokenized_text.input_ids.detach().clone()

# randomly choosing mask words:
rand = torch.rand(tokenized_text.input_ids.shape)
mask_arr = (rand < 0.15)*(tokenized_text.input_ids > 2)

# get mask index from tokenizer
mask_index = alephbert_tokenizer.convert_tokens_to_ids('[MASK]')

# get indexes of chosen words to be masked
selection = []
for i in range(mask_arr.shape[0]):
    selection.append(
        torch.flatten(mask_arr[i].nonzero()).tolist()
        
    )

# change the chosen words to mask index
for i in range(mask_arr.shape[0]):
    tokenized_text.input_ids[i, selection[i]] = mask_index

# a class for mimiking a dataset
class MakeDataSet(torch.utils.data.Dataset):
    def __init__(self, encodings):
        self.encodings = encodings
    def __getitem__(self, idx):
        return {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
    def __len__(self):
        return len(self.encodings.input_ids)

dataset = MakeDataSet(tokenized_text)

# for batching
dataloader = torch.utils.data.DataLoader(dataset, batch_size=8, shuffle=True)

# optimizer method
optim = AdamW(alephbert.parameters(), lr=1e-5)

# loading bar
from tqdm import tqdm

epochs = 1

for epoch in range(epochs):
    loop = tqdm(dataloader, leave=True)

    for batch in loop:
        # batch is a part of the dataset, loaded by the dataloader
        optim.zero_grad()
        input_ids = batch['input_ids']#.to(device)
        attention_mask = batch['attention_mask']#.to(device)
        labels = batch['labels']#.to(device)

        # feeding inputs to the model
        outputs = alephbert(input_ids, attention_mask=attention_mask, labels=labels)

        # loss
        loss = outputs.loss
        loss.backward()
        optim.step()

        # description
        loop.set_description(f'Epoch {epoch}')
        loop.set_postfix(loss=loss.item())

import pickle
pickle.dump(alephbert, open('../myFirstTune/tune1.pkl', 'wb'))

# loaded = pickle.load(open('../myFirstTune/tune1.pkl', 'rb'))
# disable weights:
alephbert.eval()


