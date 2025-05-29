
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const RecordScreen = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [dosages, setDosages] = useState<{ [key: string]: string }>({});
  const [memos, setMemos] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // サンプル薬剤データ
  const medications = [
    { id: '1', name: 'ロキソニン錠60mg', standardDose: '1', unit: '錠' },
    { id: '2', name: 'ガスター錠20mg', standardDose: '1', unit: '錠' },
    { id: '3', name: 'ムコダイン錠250mg', standardDose: '3', unit: '錠' },
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
    setSelectedTime('');
    setSelectedMedications([]);
    setDosages({});
    setMemos({});
  };

  const today = new Date();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const formattedDate = `${today.getMonth() + 1}月${today.getDate()}日 (${weekdays[today.getDay()]})`;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            服薬記録 - {formattedDate}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="time" className="text-sm font-medium text-gray-700">
              服用時刻 *
            </Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              服用薬選択 *
            </Label>
            <div className="space-y-4">
              {medications.map((medication) => (
                <Card key={medication.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={medication.id}
                      checked={selectedMedications.includes(medication.id)}
                      onCheckedChange={(checked) => 
                        handleMedicationToggle(medication.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor={medication.id} className="font-medium cursor-pointer">
                          {medication.name}
                        </Label>
                        <p className="text-sm text-gray-500">
                          標準服用量: {medication.standardDose} {medication.unit}
                        </p>
                      </div>
                      
                      {selectedMedications.includes(medication.id) && (
                        <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              服用量
                            </Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                type="number"
                                step="0.5"
                                min="0"
                                value={dosages[medication.id] || ''}
                                onChange={(e) => setDosages(prev => ({
                                  ...prev,
                                  [medication.id]: e.target.value
                                }))}
                                className="w-20"
                              />
                              <span className="text-sm text-gray-600">
                                {medication.unit}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              メモ（任意）
                            </Label>
                            <Textarea
                              value={memos[medication.id] || ''}
                              onChange={(e) => setMemos(prev => ({
                                ...prev,
                                [medication.id]: e.target.value
                              }))}
                              placeholder="服用に関するメモがあれば記入してください"
                              className="mt-1 resize-none"
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
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3"
            size="lg"
          >
            記録する
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
