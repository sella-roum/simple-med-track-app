
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MedicationManagementScreen = () => {
  const [medications, setMedications] = useState([
    { id: '1', name: 'ロキソニン錠60mg', standardDose: '1', unit: '錠', memo: '痛み止め' },
    { id: '2', name: 'ガスター錠20mg', standardDose: '1', unit: '錠', memo: '胃薬' },
    { id: '3', name: 'ムコダイン錠250mg', standardDose: '3', unit: '錠', memo: '去痰薬' },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    standardDose: '',
    unit: '',
    memo: ''
  });
  
  const { toast } = useToast();

  const handleOpenDialog = (medication = null) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData(medication);
    } else {
      setEditingMedication(null);
      setFormData({ name: '', standardDose: '', unit: '', memo: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMedication(null);
    setFormData({ name: '', standardDose: '', unit: '', memo: '' });
  };

  const handleSave = () => {
    if (!formData.name || !formData.standardDose || !formData.unit) {
      toast({
        title: "エラー",
        description: "薬剤名、標準服用量、単位は必須項目です。",
        variant: "destructive",
      });
      return;
    }

    if (editingMedication) {
      // 編集
      setMedications(prev => prev.map(med => 
        med.id === editingMedication.id 
          ? { ...med, ...formData }
          : med
      ));
      toast({
        title: "更新完了",
        description: "薬剤情報を更新しました。",
      });
    } else {
      // 新規登録
      const newMedication = {
        id: Date.now().toString(),
        ...formData
      };
      setMedications(prev => [...prev, newMedication]);
      toast({
        title: "登録完了",
        description: "新しい薬剤を登録しました。",
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (medicationId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
    toast({
      title: "削除完了",
      description: "薬剤情報を削除しました。",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            薬剤管理
          </CardTitle>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                新しい薬を登録
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMedication ? '薬剤情報編集' : '新しい薬剤登録'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medicationName" className="text-sm font-medium text-gray-700">
                    薬剤名 *
                  </Label>
                  <Input
                    id="medicationName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例：ロキソニン錠60mg"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="standardDose" className="text-sm font-medium text-gray-700">
                      標準服用量 *
                    </Label>
                    <Input
                      id="standardDose"
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.standardDose}
                      onChange={(e) => setFormData(prev => ({ ...prev, standardDose: e.target.value }))}
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                      単位 *
                    </Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="錠"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="medicationMemo" className="text-sm font-medium text-gray-700">
                    メモ（任意）
                  </Label>
                  <Textarea
                    id="medicationMemo"
                    value={formData.memo}
                    onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="薬剤に関するメモがあれば記入してください"
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    保存
                  </Button>
                  <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
                    キャンセル
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {medications.map((medication) => (
              <Card key={medication.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-800">
                        {medication.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {medication.standardDose} {medication.unit}
                      </Badge>
                    </div>
                    
                    {medication.memo && (
                      <p className="text-sm text-gray-600">
                        {medication.memo}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(medication)}
                    >
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(medication.id)}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {medications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                登録されている薬剤がありません。
                <br />
                「新しい薬を登録」ボタンから薬剤を追加してください。
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
