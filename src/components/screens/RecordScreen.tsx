
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, Info } from 'lucide-react';

export const RecordScreen = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [dosages, setDosages] = useState<{ [key: string]: string }>({});
  const [memos, setMemos] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // 現在時刻を初期値としてセット
  useEffect(() => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    setSelectedTime(currentTime);
  }, []);

  // サンプル薬剤データ（メモを追加）
  const medications = [
    { id: '1', name: 'ロキソニン錠60mg', standardDose: '1', unit: '錠', memo: '痛み止め・食後に服用' },
    { id: '2', name: 'ガスター錠20mg', standardDose: '1', unit: '錠', memo: '胃薬・空腹時でも可' },
    { id: '3', name: 'ムコダイン錠250mg', standardDose: '3', unit: '錠', memo: '去痰薬・水分を多めに摂取' },
  ];

  const handleMedicationToggle = (medicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedMedications([...selectedMedications, medicationId]);
      const medication = medications.find(m => m.id === medicationId);
      if (medication) {
        setDosages(prev => ({ ...prev, [medicationId]: medication.standardDose }));
      }
    } else {
      setSelectedMedications(selectedMedications.filter(id => id !== medicationId));
      setDosages(prev => {
        const newDosages = { ...prev };
        delete newDosages[medicationId];
        return newDosages;
      });
      setMemos(prev => {
        const newMemos = { ...prev };
        delete newMemos[medicationId];
        return newMemos;
      });
    }
  };

  const handleRecord = () => {
    if (selectedMedications.length === 0) {
      toast({
        title: "エラー",
        description: "服用する薬剤を選択してください。",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "エラー",
        description: "服用時刻を入力してください。",
        variant: "destructive",
      });
      return;
    }

    // 記録処理（実際の実装ではAPIを呼び出すなど）
    console.log('Recording:', { selectedTime, selectedMedications, dosages, memos });
    
    toast({
      title: "記録完了",
      description: "服薬記録を保存しました。",
    });

    // フォームリセット
    const now = new Date();
    const currentTime = now.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    setSelectedTime(currentTime);
    setSelectedMedications([]);
    setDosages({});
    setMemos({});
  };

  const today = new Date();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const formattedDate = `${today.getMonth() + 1}月${today.getDate()}日 (${weekdays[today.getDay()]})`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">服薬記録</h2>
        <p className="text-lg text-indigo-600 font-medium flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          {formattedDate}
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            服薬情報の入力
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              服用時刻 *
            </Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <Label className="text-sm font-medium text-gray-700 mb-4 block">
              服用薬選択 *
            </Label>
            <div className="space-y-4">
              {medications.map((medication) => (
                <Card key={medication.id} className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-indigo-500">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={medication.id}
                      checked={selectedMedications.includes(medication.id)}
                      onCheckedChange={(checked) => 
                        handleMedicationToggle(medication.id, checked as boolean)
                      }
                      className="mt-1 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor={medication.id} className="font-medium cursor-pointer text-gray-800">
                          {medication.name}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          標準服用量: {medication.standardDose} {medication.unit}
                        </p>
                        {medication.memo && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            <p className="text-sm text-indigo-700">{medication.memo}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedMedications.includes(medication.id) && (
                        <div className="space-y-4 pl-4 border-l-2 border-indigo-200 bg-indigo-50 p-4 rounded-lg animate-fade-in">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              服用量
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                step="0.5"
                                min="0"
                                value={dosages[medication.id] || ''}
                                onChange={(e) => setDosages(prev => ({
                                  ...prev,
                                  [medication.id]: e.target.value
                                }))}
                                className="w-24 border-indigo-200 focus:border-indigo-500"
                              />
                              <span className="text-sm text-gray-600 font-medium">
                                {medication.unit}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              メモ（任意）
                            </Label>
                            <Textarea
                              value={memos[medication.id] || ''}
                              onChange={(e) => setMemos(prev => ({
                                ...prev,
                                [medication.id]: e.target.value
                              }))}
                              placeholder="服用に関するメモがあれば記入してください"
                              className="resize-none border-indigo-200 focus:border-indigo-500"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleRecord}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            記録する
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
