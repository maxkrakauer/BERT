import json
from transformers import BertForMaskedLM, BertTokenizerFast
import torch
import pickle
import io
import sys

torch.device('cpu')

class CPU_Unpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == 'torch.storage' and name == '_load_from_bytes':
            return lambda b: torch.load(io.BytesIO(b), map_location='cpu')
        else: return super().find_class(module, name)

alephbert_tokenizer = BertTokenizerFast.from_pretrained('onlplab/alephbert-base')
alephbert = CPU_Unpickler(open('../AlephBERT-main/models/myFirstTune/tune_2.pkl', 'rb')).load()
# alephbert = CPU_Unpickler(open('../../models/myFirstTune/tune_2.pkl', 'rb')).load()

text = sys.argv[1]
mask = sys.argv[2]

text = text.replace(mask, '[MASK]')
hebrew_text = '[CLS] ' + text + ' . [SEP]'

tokenized_text = alephbert_tokenizer.tokenize(hebrew_text)
indexed_tokens = alephbert_tokenizer.convert_tokens_to_ids(tokenized_text)


# Create the segments tensors.
segments_ids = [0] * len(tokenized_text)

# Convert inputs to PyTorch tensors
tokens_tensor = torch.tensor([indexed_tokens])

segments_tensors = torch.tensor([segments_ids])

# Load pre-trained model (weights)
alephbert.eval()

# Predict all tokens
with torch.no_grad():
    predictions = alephbert(tokens_tensor, segments_tensors)

masked_index = tokenized_text.index('[MASK]')
num_of_res = 10

predicted_sorted = torch.argsort(predictions[0][0, masked_index], descending=True)
topres = alephbert_tokenizer.convert_ids_to_tokens([x.item() for x in predicted_sorted[:num_of_res]])

def probs_from_predictions(predictions):
    min_prediction = -predictions[0][0, masked_index][predicted_sorted[-1]]
    sum_of_predictions = torch.sum(predictions[0][0, masked_index])
    return (predictions[0][0, masked_index] + min_prediction) / (sum_of_predictions + min_prediction * len(predicted_sorted))

probs = probs_from_predictions(predictions)

sum_of_probs = torch.sum(probs)
assert(abs(sum_of_probs - 1) < 0.00001)

top_probs = torch.tensor([probs[alephbert_tokenizer.convert_tokens_to_ids([res])[0]].item() for res in topres])
sum_of_top = torch.sum(top_probs)

relative_probs = top_probs / sum_of_top

with_prob = list(zip(topres, relative_probs.tolist()))

# as_dicts = []
# for (w,p) in with_prob:
#     as_dicts.append({'word': w, 'prob': p})
print(json.dumps(with_prob))