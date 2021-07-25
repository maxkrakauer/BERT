from transformers import BertForMaskedLM, BertTokenizerFast
import io
alephbert_tokenizer = BertTokenizerFast.from_pretrained('onlplab/alephbert-base')

import pickle
import torch

torch.device('cpu')

class CPU_Unpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == 'torch.storage' and name == '_load_from_bytes':
            return lambda b: torch.load(io.BytesIO(b), map_location='cpu')
        else: return super().find_class(module, name)

model_beforeFT = pickle.load(open('../myFirstTune/tune0.pkl', 'rb'))
model_afterFT = CPU_Unpickler(open('../myFirstTune/tune1.pkl', 'rb')).load()

hebrew_text = '[CLS]  כל טענה [MASK] יש להוכיח . [SEP]'

tokenized_text = alephbert_tokenizer.tokenize(hebrew_text)
indexed_tokens = alephbert_tokenizer.convert_tokens_to_ids(tokenized_text)


# Create the segments tensors.
segments_ids = [0] * len(tokenized_text)

# Convert inputs to PyTorch tensors
tokens_tensor = torch.tensor([indexed_tokens])

segments_tensors = torch.tensor([segments_ids])

# Load pre-trained model (weights)
model_beforeFT.eval()
model_afterFT.eval()

# Predict all tokens
with torch.no_grad():
    predictions = model_beforeFT(tokens_tensor, segments_tensors)
    predictions_FT = model_afterFT(tokens_tensor, segments_tensors)

masked_index = tokenized_text.index('[MASK]')

predicted_sorted = torch.argsort(predictions[0][0, masked_index], descending=True)
predicted_sorted_FT = torch.argsort(predictions_FT[0][0, masked_index], descending=True)

print('before:')
print(alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted[:20]]))
print('after:')
print(alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted_FT[:20]]))

print('index of מתמטית: ')
print('before:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted]).index('מתמטית'))
print('after:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted_FT]).index('מתמטית'))

print('index of מדעית: ')
print('before:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted]).index('מדעית'))
print('after:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted_FT]).index('מדעית'))

print('index of רצויה: ')
print('before:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted]).index('רצויה'))
print('after:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted_FT]).index('רצויה'))

print('index of וטענה: ')
print('before:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted]).index('וטענה'))
print('after:', alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted_FT]).index('וטענה'))